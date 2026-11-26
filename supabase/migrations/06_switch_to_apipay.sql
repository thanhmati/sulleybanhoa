-- Migration: 06_switch_to_apipay.sql
-- Description: Chuyển đổi hệ thống tự động xác nhận thanh toán từ SePay sang ApiPay.
--              Hoàn toàn non-destructive (không DROP dữ liệu/bảng cũ):
--              - Đổi default provider của bank_webhook_logs sang 'APIPAY'
--              - Bổ sung cột is_sandbox đánh dấu giao dịch Sandbox / Live Test
--              - Tạo RPC atomic public.process_bank_payment(...) dùng external_tx_id (transactionId của ApiPay)

-- ============================================================================
-- 1. CẬP NHẬT BẢNG BANK_WEBHOOK_LOGS CHO APIPAY
-- ============================================================================

ALTER TABLE public.bank_webhook_logs
  ALTER COLUMN provider SET DEFAULT 'APIPAY';

ALTER TABLE public.bank_webhook_logs
  ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.bank_webhook_logs.is_sandbox IS 'TRUE nếu giao dịch đến từ môi trường ApiPay Sandbox hoặc Live Test';

-- ============================================================================
-- 2. POSTGRES RPC ATOMIC XỬ LÝ THANH TOÁN TỪ APIPAY (WEBHOOK & METRICS API)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.process_bank_payment(
  p_provider TEXT DEFAULT 'APIPAY',
  p_external_tx_id TEXT DEFAULT NULL,
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
  p_expected_account_number TEXT DEFAULT NULL,
  p_is_sandbox BOOLEAN DEFAULT FALSE
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

  -- 1. Chống trùng lặp atomic theo external_tx_id (ApiPay transactionId dùng chung cho cả Webhook và Metrics API)
  IF p_external_tx_id IS NULL OR BTRIM(p_external_tx_id) = '' THEN
    RAISE EXCEPTION 'Yêu cầu phải có external_tx_id (transactionId)';
  END IF;

  INSERT INTO public.bank_webhook_logs (
    provider, external_tx_id, gateway, account_number, sub_account,
    transfer_type, amount, payment_code, content, reference_code, transaction_date,
    match_status, webhook_success, source, raw_payload, is_sandbox
  )
  VALUES (
    p_provider, BTRIM(p_external_tx_id), p_gateway, p_account_number, p_sub_account,
    p_transfer_type, GREATEST(0, p_amount), NULLIF(v_clean_code, ''), p_content,
    p_reference_code, p_transaction_date, 'UNMATCHED', FALSE, p_source,
    COALESCE(p_raw_payload, '{}'::jsonb), COALESCE(p_is_sandbox, FALSE)
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

  -- 2. Chỉ xử lý giao dịch tiền vào có số tiền dương
  IF p_transfer_type <> 'in' OR p_amount <= 0 THEN
    UPDATE public.bank_webhook_logs
    SET match_status = 'IGNORED',
        webhook_success = FALSE,
        note = 'Bỏ qua giao dịch không phải tiền vào dương'
    WHERE id = v_log_id;

    RETURN jsonb_build_object('duplicate', FALSE, 'success', FALSE, 'match_status', 'IGNORED', 'log_id', v_log_id);
  END IF;

  -- 3. Kiểm tra tài khoản nhận khớp cấu hình cửa hàng (nếu có truyền p_expected_account_number và payload không phải sandbox thiếu STK)
  IF v_expected_acc <> '' AND NOT (COALESCE(p_is_sandbox, FALSE) AND COALESCE(p_account_number, '') = '' AND COALESCE(p_sub_account, '') = '') THEN
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
        note = 'Không tìm thấy mã đơn hàng (VD: ORD000001) trong nội dung chuyển khoản'
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

REVOKE EXECUTE ON FUNCTION public.process_bank_payment(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TEXT, JSONB, TEXT, BOOLEAN
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.process_bank_payment(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TEXT, JSONB, TEXT, BOOLEAN
) TO service_role;
