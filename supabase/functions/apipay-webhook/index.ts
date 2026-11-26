/* global Deno */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  extractOrderPaymentCode,
  maskAccountLast4,
  normalizeExpectedAccount,
  toIsoTimestamp,
  verifyApiPaySignature,
} from '../_shared/apipay.ts';

interface ApiPayWebhookData {
  transactionId?: string;
  publicId?: string;
  referenceCode?: string | null;
  amount?: string | number;
  type?: 'IN' | 'OUT' | string;
  content?: string;
  transactionDate?: string;
  bankAccountPublicId?: string;
  gateway?: string;
  accountNumber?: string;
  vaNumber?: string | null;
}

interface ApiPayWebhookPayload {
  event?: string;
  sandbox?: boolean;
  liveTest?: boolean;
  created?: string;
  data?: ApiPayWebhookData;
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return jsonResponse({ received: false, message: 'Method not allowed' }, 405);
  }

  // Đọc raw body trước khi parse JSON để đảm bảo HMAC-SHA256 khớp byte gốc
  const rawBody = await req.text();

  const webhookSecret = Deno.env.get('APIPAY_WEBHOOK_SECRET') || '';
  const signatureCheck = await verifyApiPaySignature({
    rawBody,
    signatureHeader: req.headers.get('apipay-signature'),
    secret: webhookSecret,
  });

  if (!signatureCheck.ok) {
    return jsonResponse({ received: false, message: 'Unauthorized' }, 401);
  }

  let payload: ApiPayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as ApiPayWebhookPayload;
  } catch {
    return jsonResponse({ received: false, message: 'Invalid JSON payload' }, 400);
  }

  if (payload?.event !== 'transaction.in' || !payload?.data) {
    return jsonResponse({ received: true, ignored: 'unsupported_event' }, 200);
  }

  const data = payload.data;
  const externalTxId = String(data.transactionId || data.publicId || '').trim();
  if (!externalTxId) {
    return jsonResponse({ received: false, message: 'Missing transactionId' }, 400);
  }

  const isSandbox = Boolean(payload.sandbox) || externalTxId.startsWith('test_txn_');
  const allowSandbox = (Deno.env.get('APIPAY_ALLOW_SANDBOX') || '').trim().toLowerCase() === 'true';

  // Bảo vệ production: mặc định bỏ qua mọi sự kiện sandbox / Live Test trừ khi bật APIPAY_ALLOW_SANDBOX=true
  if (isSandbox && !allowSandbox) {
    console.info('[apipay-webhook] Ignored sandbox event on production', {
      eventId: externalTxId,
      liveTest: Boolean(payload.liveTest),
    });
    return jsonResponse({ received: true, ignored: 'sandbox' }, 200);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ received: false }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: settingRow } = await supabase
    .from('store_settings')
    .select('value')
    .eq('key', 'store_invoice_bank')
    .maybeSingle();

  const expectedAccount = normalizeExpectedAccount(
    settingRow?.value as { vaNumber?: string; bankAccountNumber?: string } | null,
  );

  const transferType = String(data.type || '').toUpperCase() === 'OUT' ? 'out' : 'in';
  const amount = Math.max(0, Math.round(Number(data.amount || 0)));
  const paymentCode = extractOrderPaymentCode(data.content);

  const { data: rpcResult, error: rpcError } = await supabase.rpc('process_bank_payment', {
    p_provider: 'APIPAY',
    p_external_tx_id: externalTxId,
    p_gateway: data.gateway ?? null,
    p_account_number: data.accountNumber ?? null,
    p_sub_account: data.vaNumber ?? null,
    p_transfer_type: transferType,
    p_amount: amount,
    p_payment_code: paymentCode,
    p_content: typeof data.content === 'string' ? data.content : null,
    p_reference_code:
      typeof data.referenceCode === 'string' && data.referenceCode.trim() !== ''
        ? data.referenceCode.trim()
        : null,
    p_transaction_date: toIsoTimestamp(data.transactionDate || payload.created),
    p_source: 'WEBHOOK',
    p_raw_payload: payload,
    p_expected_account_number: expectedAccount || null,
    p_is_sandbox: isSandbox,
  });

  if (rpcError) {
    // Chỉ log định danh an toàn, không log nội dung chuyển khoản hay dữ liệu cá nhân
    console.error('[apipay-webhook] RPC error', {
      eventId: externalTxId,
      code: paymentCode,
      error: rpcError.message,
    });
    return jsonResponse({ received: false }, 500);
  }

  console.info('[apipay-webhook] Processed', {
    eventId: externalTxId,
    code: paymentCode,
    amount,
    accountMask: maskAccountLast4(data.accountNumber),
    matchStatus: rpcResult?.match_status,
    duplicate: Boolean(rpcResult?.duplicate),
    sandbox: isSandbox,
  });

  // ApiPay coi mọi status non-2xx là lỗi và retry 3 lần; đã lưu DB an toàn -> luôn trả 200
  return jsonResponse(
    {
      received: true,
      matchStatus: rpcResult?.match_status ?? null,
      duplicate: Boolean(rpcResult?.duplicate),
    },
    200,
  );
});
