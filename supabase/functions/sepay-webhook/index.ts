/* global Deno */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  maskAccountLast4,
  normalizeExpectedAccount,
  toVietnamIsoTimestamp,
  verifySePayApiKey,
  verifySePayHmacSignature,
} from '../_shared/sepay.ts';

interface SePayWebhookPayload {
  id: number | string;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  subAccount?: string | null;
  code?: string | null;
  content?: string;
  transferType?: 'in' | 'out' | string;
  description?: string;
  transferAmount?: number;
  accumulated?: number;
  referenceCode?: string | null;
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return jsonResponse({ success: false, message: 'Method not allowed' }, 405);
  }

  // Đọc raw body trước khi parse JSON để đảm bảo HMAC-SHA256 khớp byte gốc
  const rawBody = await req.text();

  const authMode = (Deno.env.get('SEPAY_AUTH_MODE') || 'hmac').trim().toLowerCase();
  if (authMode === 'apikey') {
    const expectedKey = Deno.env.get('SEPAY_WEBHOOK_API_KEY') || '';
    const check = verifySePayApiKey(req.headers.get('authorization'), expectedKey);
    if (!check.ok) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }
  } else {
    const secret = Deno.env.get('SEPAY_WEBHOOK_SECRET') || '';
    const check = await verifySePayHmacSignature({
      rawBody,
      signatureHeader: req.headers.get('x-sepay-signature'),
      timestampHeader: req.headers.get('x-sepay-timestamp'),
      secret,
    });
    if (!check.ok) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }
  }

  let payload: SePayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as SePayWebhookPayload;
  } catch {
    return jsonResponse({ success: false, message: 'Invalid JSON payload' }, 400);
  }

  if (payload?.id === undefined || payload?.id === null || String(payload.id).trim() === '') {
    return jsonResponse({ success: false, message: 'Missing transaction id' }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ success: false }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Đọc STK cấu hình của tiệm để đối chiếu (nếu đã cấu hình)
  const { data: settingRow } = await supabase
    .from('store_settings')
    .select('value')
    .eq('key', 'store_invoice_bank')
    .maybeSingle();

  const expectedAccount = normalizeExpectedAccount(
    settingRow?.value as { vaNumber?: string; bankAccountNumber?: string } | null,
  );

  const amount = Math.max(0, Math.round(Number(payload.transferAmount || 0)));
  const paymentCode =
    typeof payload.code === 'string' && payload.code.trim() !== '' ? payload.code.trim() : null;

  const { data: rpcResult, error: rpcError } = await supabase.rpc('process_sepay_payment', {
    p_provider: 'SEPAY',
    p_external_tx_id: String(payload.id),
    p_sepay_api_id: null,
    p_gateway: payload.gateway ?? null,
    p_account_number: payload.accountNumber ?? null,
    p_sub_account: payload.subAccount ?? null,
    p_transfer_type: payload.transferType === 'out' ? 'out' : 'in',
    p_amount: amount,
    p_payment_code: paymentCode,
    p_content: typeof payload.content === 'string' ? payload.content : null,
    p_reference_code:
      typeof payload.referenceCode === 'string' && payload.referenceCode.trim() !== ''
        ? payload.referenceCode.trim()
        : null,
    p_transaction_date: toVietnamIsoTimestamp(payload.transactionDate),
    p_source: 'WEBHOOK',
    p_raw_payload: payload,
    p_expected_account_number: expectedAccount || null,
  });

  if (rpcError) {
    // Chỉ log định danh an toàn, không log nội dung memo hay dữ liệu cá nhân
    console.error('[sepay-webhook] RPC error', {
      eventId: String(payload.id),
      code: paymentCode,
      error: rpcError.message,
    });
    return jsonResponse({ success: false }, 500);
  }

  console.info('[sepay-webhook] Processed', {
    eventId: String(payload.id),
    code: paymentCode,
    amount,
    accountMask: maskAccountLast4(payload.accountNumber),
    matchStatus: rpcResult?.match_status,
    duplicate: Boolean(rpcResult?.duplicate),
  });

  return jsonResponse({ success: Boolean(rpcResult?.success) }, 200);
});
