-- Migration: 07_deposit_invoice_and_webhook.sql
-- Description: Hỗ trợ luồng Hoá đơn đặt cọc và tự động cộng tiền cọc vào orders.deposit:
--              - Cập nhật RPC process_bank_payment(...) nhận diện giao dịch cọc (từ khoá COC hoặc chuyển < nợ khi đơn chưa cọc & chưa có giao dịch)
--                và cộng trực tiếp vào orders.deposit (không chèn trùng vào order_transactions để tránh trừ nợ 2 lần)
--              - Bổ sung RPC reconcile_bank_log_to_order(..., p_as_deposit) cho phép Admin gắn tay làm Tiền cọc hoặc Thanh toán

-- ============================================================================
-- 1. CẬP NHẬT RPC PROCESS_BANK_PAYMENT HỖ TRỢ TỰ ĐỘNG CẬP NHẬT TIỀN CỌC
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
  v_current_deposit BIGINT;
  v_tx_count INTEGER;
  v_has_coc_keyword BOOLEAN;
  v_apply_as_deposit BOOLEAN;
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

  -- 5. Xác định trạng thái khớp nợ và phân luồng Cọc vs Thanh toán thường
  v_due_before := ROUND(v_order.due_amount)::BIGINT;
  v_current_deposit := COALESCE(ROUND(v_order.deposit)::BIGINT, 0);

  SELECT COUNT(*)
  INTO v_tx_count
  FROM public.order_transactions
  WHERE order_id = v_order.id;

  v_has_coc_keyword := COALESCE(p_content, '') ~* '(^|[^A-Za-z0-9])COC([^A-Za-z0-9]|$|ORD[0-9]{6,8})';

  IF p_amount < v_due_before THEN
    v_match_status := 'PARTIAL';
  ELSIF p_amount > v_due_before THEN
    v_match_status := 'OVERPAID';
  ELSE
    v_match_status := 'MATCHED';
  END IF;

  -- Chỉ tự động cộng vào cột deposit khi:
  --  (a) Nội dung chuyển khoản có từ khoá COC và số tiền <= nợ hiện tại (hỗ trợ cả đơn <= 200k), HOẶC
  --  (b) Đơn chưa cọc (deposit = 0), chưa có giao dịch trước đó và khách chuyển < số tiền còn nợ
  v_apply_as_deposit :=
    (v_has_coc_keyword AND p_amount <= v_due_before)
    OR (v_current_deposit = 0 AND v_tx_count = 0 AND p_amount < v_due_before);

  IF v_apply_as_deposit THEN
    UPDATE public.orders
    SET deposit = COALESCE(deposit, 0) + p_amount,
        updated_at = NOW()
    WHERE id = v_order.id;

    v_note := 'Đã ghi nhận tiền cọc ' || p_amount::TEXT || ' đ (nợ trước cọc ' || v_due_before::TEXT || ' đ)';

    UPDATE public.bank_webhook_logs
    SET matched_order_id = v_order.id,
        order_transaction_id = NULL,
        match_status = v_match_status,
        webhook_success = TRUE,
        note = v_note
    WHERE id = v_log_id;

    RETURN jsonb_build_object(
      'duplicate', FALSE,
      'success', TRUE,
      'applied_as', 'DEPOSIT',
      'match_status', v_match_status,
      'log_id', v_log_id,
      'order_id', v_order.id,
      'order_transaction_id', NULL,
      'note', v_note
    );
  END IF;

  -- Thanh toán thường: ghi vào order_transactions (trigger tự tính lại due_amount & is_paid)
  IF p_amount < v_due_before THEN
    v_note := 'Thanh toán một phần (' || p_amount::TEXT || ' / nợ ' || v_due_before::TEXT || ')';
  ELSIF p_amount > v_due_before THEN
    v_note := 'Thanh toán dư (' || p_amount::TEXT || ' / nợ ' || v_due_before::TEXT || ')';
  ELSE
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
    'applied_as', 'TRANSACTION',
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

-- ============================================================================
-- 2. RPC ĐỐI SOÁT THỦ CÔNG HỖ TRỢ GẮN VÀO TIỀN CỌC HOẶC THANH TOÁN
-- ============================================================================

CREATE OR REPLACE FUNCTION public.reconcile_bank_log_to_order(
  p_log_id UUID,
  p_order_id UUID,
  p_as_deposit BOOLEAN DEFAULT NULL
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
  v_apply_deposit BOOLEAN;
  v_has_coc_keyword BOOLEAN;
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

  IF v_log.order_transaction_id IS NOT NULL
     OR (v_log.matched_order_id IS NOT NULL AND v_log.webhook_success) THEN
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

  v_has_coc_keyword := COALESCE(v_log.content, '') ~* '(^|[^A-Za-z0-9])COC([^A-Za-z0-9]|$|ORD[0-9]{6,8})';

  IF p_as_deposit IS NOT NULL THEN
    v_apply_deposit := p_as_deposit;
  ELSE
    v_apply_deposit :=
      (v_has_coc_keyword AND v_log.amount <= v_due_before)
      OR (COALESCE(v_order.deposit, 0) = 0 AND v_log.amount < v_due_before);
  END IF;

  IF v_apply_deposit THEN
    UPDATE public.orders
    SET deposit = COALESCE(deposit, 0) + v_log.amount,
        updated_at = NOW()
    WHERE id = v_order.id;

    UPDATE public.bank_webhook_logs
    SET matched_order_id = v_order.id,
        order_transaction_id = NULL,
        match_status = v_match_status,
        webhook_success = TRUE,
        source = 'MANUAL_ASSIGN',
        note = 'Gắn thủ công vào tiền cọc bởi quản trị viên'
    WHERE id = v_log.id;

    RETURN v_log.id;
  END IF;

  INSERT INTO public.order_transactions (order_id, amount, type, payment_date)
  VALUES (v_order.id, v_log.amount, 'BANK', COALESCE(v_log.transaction_date, NOW()))
  RETURNING id INTO v_order_tx_id;

  UPDATE public.bank_webhook_logs
  SET matched_order_id = v_order.id,
      order_transaction_id = v_order_tx_id,
      match_status = v_match_status,
      webhook_success = TRUE,
      source = 'MANUAL_ASSIGN',
      note = 'Gắn thủ công vào thanh toán bởi quản trị viên'
  WHERE id = v_log.id;

  RETURN v_order_tx_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reconcile_bank_log_to_order(UUID, UUID, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reconcile_bank_log_to_order(UUID, UUID, BOOLEAN) TO authenticated;

CREATE OR REPLACE FUNCTION public.assign_bank_log_to_order(
  p_log_id UUID,
  p_order_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN public.reconcile_bank_log_to_order(p_log_id, p_order_id, NULL);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.assign_bank_log_to_order(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.assign_bank_log_to_order(UUID, UUID) TO authenticated;
