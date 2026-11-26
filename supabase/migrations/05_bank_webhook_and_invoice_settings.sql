-- Migration: 05_bank_webhook_and_invoice_settings.sql
-- Description: Chuẩn hóa mã thanh toán đơn hàng (ORD000001), tạo bảng log & trạng thái đối soát SePay,
--              RPC xử lý thanh toán atomic và bật Supabase Realtime cho luồng thanh toán tự động.

-- ============================================================================
-- 1. CHUẨN HÓA MÃ ĐƠN HÀNG & MÃ THANH TOÁN (TƯƠNG THÍCH SEPAY PAYMENT CODE)
-- ============================================================================

-- Đơn hàng mới tạo sẽ sinh mã liền ORD000001 (không chứa dấu '-' để khớp cấu trúc mã SePay)
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.order_number IS NULL OR BTRIM(NEW.order_number) = '' THEN
    NEW.order_number := 'ORD' || TO_CHAR(NEXTVAL('public.order_number_seq'), 'FM000000');
  END IF;
  RETURN NEW;
END;
$$;

-- Bổ sung cột payment_code tự sinh giúp các đơn cũ (ORD-000001) và đơn mới (ORD000001) đều đối chiếu nhất quán
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_code TEXT GENERATED ALWAYS AS (UPPER(REPLACE(order_number, '-', ''))) STORED;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_code
  ON public.orders (payment_code);

COMMENT ON COLUMN public.orders.payment_code IS 'Mã thanh toán chuẩn hóa không dấu gạch ngang (VD: ORD000001) dùng để đối soát SePay Webhook';

-- ============================================================================
-- 2. BẢNG LƯU LOG GIAO DỊCH WEBHOOK & ĐỐI SOÁT NGÂN HÀNG
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.bank_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'SEPAY',
  external_tx_id TEXT UNIQUE,
  sepay_api_id TEXT UNIQUE,
  gateway TEXT,
  account_number TEXT,
  sub_account TEXT,
  transfer_type TEXT NOT NULL DEFAULT 'in' CHECK (transfer_type IN ('in', 'out')),
  amount BIGINT NOT NULL CHECK (amount >= 0),
  payment_code TEXT,
  content TEXT,
  reference_code TEXT,
  transaction_date TIMESTAMPTZ,
  matched_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  order_transaction_id UUID REFERENCES public.order_transactions(id) ON DELETE SET NULL,
  match_status TEXT NOT NULL DEFAULT 'UNMATCHED'
    CHECK (match_status IN ('MATCHED', 'PARTIAL', 'OVERPAID', 'UNMATCHED', 'IGNORED', 'ERROR')),
  webhook_success BOOLEAN NOT NULL DEFAULT FALSE,
  source TEXT NOT NULL DEFAULT 'WEBHOOK'
    CHECK (source IN ('WEBHOOK', 'RECONCILE_API', 'MANUAL_ASSIGN')),
  note TEXT,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bank_webhook_logs_match_status
  ON public.bank_webhook_logs (match_status);

CREATE INDEX IF NOT EXISTS idx_bank_webhook_logs_created_at
  ON public.bank_webhook_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bank_webhook_logs_matched_order_id
  ON public.bank_webhook_logs (matched_order_id);

CREATE INDEX IF NOT EXISTS idx_bank_webhook_logs_payment_code
  ON public.bank_webhook_logs (payment_code);

CREATE INDEX IF NOT EXISTS idx_bank_webhook_logs_dedupe_transfer
  ON public.bank_webhook_logs (account_number, amount, transaction_date, reference_code);

DROP TRIGGER IF EXISTS update_bank_webhook_logs_updated_at ON public.bank_webhook_logs;
CREATE TRIGGER update_bank_webhook_logs_updated_at
  BEFORE UPDATE ON public.bank_webhook_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Bảng lưu con trỏ đồng bộ API v2 (/v2/transactions?since_id=...)
CREATE TABLE IF NOT EXISTS public.bank_sync_state (
  provider TEXT PRIMARY KEY,
  last_sepay_api_id TEXT,
  last_synced_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_bank_sync_state_updated_at ON public.bank_sync_state;
CREATE TRIGGER update_bank_sync_state_updated_at
  BEFORE UPDATE ON public.bank_sync_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.bank_webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_sync_state ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON public.bank_webhook_logs TO authenticated;
GRANT ALL ON public.bank_webhook_logs TO service_role;
GRANT SELECT ON public.bank_sync_state TO authenticated;
GRANT ALL ON public.bank_sync_state TO service_role;

DROP POLICY IF EXISTS "Staff can view bank_webhook_logs" ON public.bank_webhook_logs;
CREATE POLICY "Staff can view bank_webhook_logs"
  ON public.bank_webhook_logs
  FOR SELECT
  TO authenticated
  USING (
    COALESCE(((select auth.jwt()) -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator'
    OR COALESCE(((select auth.jwt()) -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'sales'
  );

DROP POLICY IF EXISTS "Admins can update bank_webhook_logs" ON public.bank_webhook_logs;
CREATE POLICY "Admins can update bank_webhook_logs"
  ON public.bank_webhook_logs
  FOR UPDATE
  TO authenticated
  USING (
    COALESCE(((select auth.jwt()) -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator'
  )
  WITH CHECK (
    COALESCE(((select auth.jwt()) -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator'
  );

DROP POLICY IF EXISTS "Admins can view bank_sync_state" ON public.bank_sync_state;
CREATE POLICY "Admins can view bank_sync_state"
  ON public.bank_sync_state
  FOR SELECT
  TO authenticated
  USING (
    COALESCE(((select auth.jwt()) -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator'
  );

-- ============================================================================
-- 4. POSTGRES RPC ATOMIC XỬ LÝ THANH TOÁN SEPAY & GẮN ĐƠN THỦ CÔNG
-- ============================================================================

CREATE OR REPLACE FUNCTION public.process_sepay_payment(
  p_provider TEXT DEFAULT 'SEPAY',
  p_external_tx_id TEXT DEFAULT NULL,
  p_sepay_api_id TEXT DEFAULT NULL,
  p_gateway TEXT DEFAULT NULL,
  p_account_number TEXT DEFAULT NULL,
  p_sub_account TEXT DEFAULT NULL,
  p_transfer_type TEXT DEFAULT 'in',
  p_amount BIGINT DEFAULT 0,
  p_payment_code TEXT DEFAULT NULL,
  p_content TEXT DEFAULT NULL,
  p_reference_code TEXT DEFAULT NULL,
  p_transaction_date TIMESTAMPTZ DEFAULT NOW(),
  p_source TEXT DEFAULT 'WEBHOOK',
  p_raw_payload JSONB DEFAULT '{}'::jsonb,
  p_expected_account_number TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_log_id UUID;
  v_existing RECORD;
  v_order RECORD;
  v_order_tx_id UUID;
  v_clean_code TEXT;
  v_due_before BIGINT;
  v_match_status TEXT;
  v_note TEXT;
  v_expected_acc TEXT;
BEGIN
  v_clean_code := UPPER(REGEXP_REPLACE(COALESCE(p_payment_code, ''), '[^A-Za-z0-9]', '', 'g'));
  v_expected_acc := REGEXP_REPLACE(COALESCE(p_expected_account_number, ''), '[^A-Za-z0-9]', '', 'g');

  -- 1. Chống trùng lặp atomic theo external_tx_id (Webhook) hoặc sepay_api_id (API v2)
  IF p_external_tx_id IS NOT NULL AND BTRIM(p_external_tx_id) <> '' THEN
    INSERT INTO public.bank_webhook_logs (
      provider, external_tx_id, sepay_api_id, gateway, account_number, sub_account,
      transfer_type, amount, payment_code, content, reference_code, transaction_date,
      match_status, webhook_success, source, raw_payload
    )
    VALUES (
      p_provider, BTRIM(p_external_tx_id), NULLIF(BTRIM(COALESCE(p_sepay_api_id, '')), ''),
      p_gateway, p_account_number, p_sub_account, p_transfer_type, GREATEST(0, p_amount),
      NULLIF(v_clean_code, ''), p_content, p_reference_code, p_transaction_date,
      'UNMATCHED', FALSE, p_source, COALESCE(p_raw_payload, '{}'::jsonb)
    )
    ON CONFLICT (external_tx_id) DO NOTHING
    RETURNING id INTO v_log_id;

    IF v_log_id IS NULL THEN
      SELECT id, match_status, webhook_success, matched_order_id, order_transaction_id
      INTO v_existing
      FROM public.bank_webhook_logs
      WHERE external_tx_id = BTRIM(p_external_tx_id);

      RETURN jsonb_build_object(
        'duplicate', TRUE,
        'success', COALESCE(v_existing.webhook_success, FALSE),
        'match_status', v_existing.match_status,
        'log_id', v_existing.id,
        'order_id', v_existing.matched_order_id,
        'order_transaction_id', v_existing.order_transaction_id
      );
    END IF;
  ELSIF p_sepay_api_id IS NOT NULL AND BTRIM(p_sepay_api_id) <> '' THEN
    -- Nếu webhook đã xử lý giao dịch này trước đó (so theo STK + số tiền + thời gian + mã tham chiếu), gắn sepay_api_id và bỏ qua
    SELECT id, match_status, webhook_success, matched_order_id, order_transaction_id
    INTO v_existing
    FROM public.bank_webhook_logs
    WHERE sepay_api_id = BTRIM(p_sepay_api_id)
       OR (
         source = 'WEBHOOK'
         AND amount = p_amount
         AND COALESCE(account_number, '') = COALESCE(p_account_number, '')
         AND COALESCE(reference_code, '') = COALESCE(p_reference_code, '')
         AND transaction_date = p_transaction_date
       )
    LIMIT 1;

    IF FOUND THEN
      UPDATE public.bank_webhook_logs
      SET sepay_api_id = COALESCE(sepay_api_id, BTRIM(p_sepay_api_id))
      WHERE id = v_existing.id;

      RETURN jsonb_build_object(
        'duplicate', TRUE,
        'success', COALESCE(v_existing.webhook_success, FALSE),
        'match_status', v_existing.match_status,
        'log_id', v_existing.id,
        'order_id', v_existing.matched_order_id,
        'order_transaction_id', v_existing.order_transaction_id
      );
    END IF;

    INSERT INTO public.bank_webhook_logs (
      provider, sepay_api_id, gateway, account_number, sub_account,
      transfer_type, amount, payment_code, content, reference_code, transaction_date,
      match_status, webhook_success, source, raw_payload
    )
    VALUES (
      p_provider, BTRIM(p_sepay_api_id), p_gateway, p_account_number, p_sub_account,
      p_transfer_type, GREATEST(0, p_amount), NULLIF(v_clean_code, ''), p_content,
      p_reference_code, p_transaction_date, 'UNMATCHED', FALSE, p_source,
      COALESCE(p_raw_payload, '{}'::jsonb)
    )
    ON CONFLICT (sepay_api_id) DO NOTHING
    RETURNING id INTO v_log_id;

    IF v_log_id IS NULL THEN
      RETURN jsonb_build_object('duplicate', TRUE, 'success', FALSE, 'match_status', 'IGNORED');
    END IF;
  ELSE
    RAISE EXCEPTION 'Yêu cầu phải có external_tx_id hoặc sepay_api_id';
  END IF;

  -- 2. Chỉ xử lý giao dịch tiền vào có số tiền dương
  IF p_transfer_type <> 'in' OR p_amount <= 0 THEN
    UPDATE public.bank_webhook_logs
    SET match_status = 'IGNORED',
        webhook_success = FALSE,
        note = 'Bỏ qua giao dịch không phải tiền vào dương'
    WHERE id = v_log_id;

    RETURN jsonb_build_object('duplicate', FALSE, 'success', FALSE, 'match_status', 'IGNORED', 'log_id', v_log_id);
  END IF;

  -- 3. Kiểm tra tài khoản nhận khớp cấu hình cửa hàng (nếu có truyền p_expected_account_number)
  IF v_expected_acc <> '' THEN
    IF REGEXP_REPLACE(COALESCE(p_account_number, ''), '[^A-Za-z0-9]', '', 'g') <> v_expected_acc
       AND REGEXP_REPLACE(COALESCE(p_sub_account, ''), '[^A-Za-z0-9]', '', 'g') <> v_expected_acc THEN
      UPDATE public.bank_webhook_logs
      SET match_status = 'IGNORED',
          webhook_success = FALSE,
          note = 'Tài khoản nhận không khớp cấu hình cửa hàng'
      WHERE id = v_log_id;

      RETURN jsonb_build_object('duplicate', FALSE, 'success', FALSE, 'match_status', 'IGNORED', 'log_id', v_log_id);
    END IF;
  END IF;

  -- 4. Đối chiếu đơn hàng qua mã thanh toán chuẩn hóa (khóa dòng FOR UPDATE chống race condition)
  IF v_clean_code = '' THEN
    UPDATE public.bank_webhook_logs
    SET match_status = 'UNMATCHED',
        webhook_success = FALSE,
        note = 'Không nhận diện được mã thanh toán từ SePay'
    WHERE id = v_log_id;

    RETURN jsonb_build_object('duplicate', FALSE, 'success', FALSE, 'match_status', 'UNMATCHED', 'log_id', v_log_id);
  END IF;

  SELECT *
  INTO v_order
  FROM public.orders
  WHERE payment_code = v_clean_code
  FOR UPDATE;

  IF NOT FOUND THEN
    UPDATE public.bank_webhook_logs
    SET match_status = 'UNMATCHED',
        webhook_success = FALSE,
        note = 'Không tìm thấy đơn hàng với mã ' || v_clean_code
    WHERE id = v_log_id;

    RETURN jsonb_build_object('duplicate', FALSE, 'success', FALSE, 'match_status', 'UNMATCHED', 'log_id', v_log_id);
  END IF;

  IF v_order.status = 'CANCELLED' THEN
    UPDATE public.bank_webhook_logs
    SET matched_order_id = v_order.id,
        match_status = 'UNMATCHED',
        webhook_success = FALSE,
        note = 'Đơn hàng đã bị huỷ, không tự động ghi nhận thanh toán'
    WHERE id = v_log_id;

    RETURN jsonb_build_object(
      'duplicate', FALSE, 'success', FALSE, 'match_status', 'UNMATCHED',
      'log_id', v_log_id, 'order_id', v_order.id
    );
  END IF;

  IF v_order.is_paid OR v_order.due_amount <= 0 THEN
    UPDATE public.bank_webhook_logs
    SET matched_order_id = v_order.id,
        match_status = 'OVERPAID',
        webhook_success = FALSE,
        note = 'Đơn hàng đã thanh toán đủ trước đó (giao dịch trùng/dư cần kiểm tra)'
    WHERE id = v_log_id;

    RETURN jsonb_build_object(
      'duplicate', FALSE, 'success', FALSE, 'match_status', 'OVERPAID',
      'log_id', v_log_id, 'order_id', v_order.id
    );
  END IF;

  -- 5. Ghi nhận giao dịch vào order_transactions (trigger tự tính lại due_amount & is_paid)
  v_due_before := ROUND(v_order.due_amount)::BIGINT;
  IF p_amount < v_due_before THEN
    v_match_status := 'PARTIAL';
    v_note := 'Thanh toán một phần (' || p_amount::TEXT || ' / nợ ' || v_due_before::TEXT || ')';
  ELSIF p_amount > v_due_before THEN
    v_match_status := 'OVERPAID';
    v_note := 'Thanh toán dư (' || p_amount::TEXT || ' / nợ ' || v_due_before::TEXT || ')';
  ELSE
    v_match_status := 'MATCHED';
    v_note := 'Khớp thanh toán đủ 100%';
  END IF;

  INSERT INTO public.order_transactions (order_id, amount, type, payment_date)
  VALUES (v_order.id, p_amount, 'BANK', COALESCE(p_transaction_date, NOW()))
  RETURNING id INTO v_order_tx_id;

  UPDATE public.bank_webhook_logs
  SET matched_order_id = v_order.id,
      order_transaction_id = v_order_tx_id,
      match_status = v_match_status,
      webhook_success = TRUE,
      note = v_note
  WHERE id = v_log_id;

  RETURN jsonb_build_object(
    'duplicate', FALSE,
    'success', TRUE,
    'match_status', v_match_status,
    'log_id', v_log_id,
    'order_id', v_order.id,
    'order_transaction_id', v_order_tx_id,
    'note', v_note
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.process_sepay_payment(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TEXT, JSONB, TEXT
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.process_sepay_payment(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TEXT, JSONB, TEXT
) TO service_role;

-- RPC cho Admin gắn tay giao dịch chưa khớp vào một đơn hàng
CREATE OR REPLACE FUNCTION public.assign_bank_log_to_order(
  p_log_id UUID,
  p_order_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_log RECORD;
  v_order RECORD;
  v_order_tx_id UUID;
  v_due_before BIGINT;
  v_match_status TEXT;
BEGIN
  IF (select auth.uid()) IS NULL OR NOT (
    COALESCE(((select auth.jwt()) -> 'app_metadata' -> 'roles')::jsonb, '[]'::jsonb) ? 'administrator'
  ) THEN
    RAISE EXCEPTION 'Chỉ quản trị viên mới có quyền đối soát gắn giao dịch';
  END IF;

  SELECT * INTO v_log
  FROM public.bank_webhook_logs
  WHERE id = p_log_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Không tìm thấy bản ghi giao dịch';
  END IF;

  IF v_log.order_transaction_id IS NOT NULL THEN
    RAISE EXCEPTION 'Giao dịch này đã được gắn vào đơn hàng trước đó';
  END IF;

  IF v_log.transfer_type <> 'in' OR v_log.amount <= 0 THEN
    RAISE EXCEPTION 'Chỉ có thể gắn giao dịch tiền vào có số tiền dương';
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Không tìm thấy đơn hàng';
  END IF;

  IF v_order.status = 'CANCELLED' THEN
    RAISE EXCEPTION 'Không thể gắn thanh toán cho đơn hàng đã huỷ';
  END IF;

  v_due_before := ROUND(v_order.due_amount)::BIGINT;
  IF v_log.amount < v_due_before THEN
    v_match_status := 'PARTIAL';
  ELSIF v_log.amount > v_due_before THEN
    v_match_status := 'OVERPAID';
  ELSE
    v_match_status := 'MATCHED';
  END IF;

  INSERT INTO public.order_transactions (order_id, amount, type, payment_date)
  VALUES (v_order.id, v_log.amount, 'BANK', COALESCE(v_log.transaction_date, NOW()))
  RETURNING id INTO v_order_tx_id;

  UPDATE public.bank_webhook_logs
  SET matched_order_id = v_order.id,
      order_transaction_id = v_order_tx_id,
      match_status = v_match_status,
      source = 'MANUAL_ASSIGN',
      note = 'Gắn thủ công bởi quản trị viên'
  WHERE id = v_log.id;

  RETURN v_order_tx_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.assign_bank_log_to_order(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.assign_bank_log_to_order(UUID, UUID) TO authenticated;

-- ============================================================================
-- 5. BẬT SUPABASE REALTIME CHO ORDERS, ORDER_TRANSACTIONS & BANK_WEBHOOK_LOGS
-- ============================================================================

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.order_transactions;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.bank_webhook_logs;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;
