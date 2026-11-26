/* global Deno */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  buildApiPayAuthHeader,
  extractOrderPaymentCode,
  normalizeExpectedAccount,
  toIsoTimestamp,
} from '../_shared/apipay.ts';

interface ApiPayMetricsTransaction {
  id: string;
  amount?: string | number;
  type?: 'IN' | 'OUT' | string;
  content?: string;
  referenceCode?: string | null;
  transactionDate?: string;
  status?: string;
  bankAccount?: {
    bankShortName?: string;
    bankName?: string;
    accountNumber?: string;
    vaNumber?: string | null;
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function toVietnamDateString(date: Date): string {
  const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return vnTime.toISOString().slice(0, 10);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const accessKey = (Deno.env.get('APIPAY_ACCESS_KEY') || '').trim();
  const secretKey = (Deno.env.get('APIPAY_SECRET_KEY') || '').trim();
  const apipayBaseUrl = (Deno.env.get('APIPAY_API_BASE_URL') || 'https://app.apipay.vn').replace(
    /\/$/,
    '',
  );

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return jsonResponse({ error: 'Server environment is misconfigured' }, 500);
  }

  // Xác thực người dùng gọi đối soát phải có role administrator trong app_metadata
  const authHeader = req.headers.get('authorization') || '';
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  const roles = Array.isArray(user?.app_metadata?.roles) ? user.app_metadata.roles : [];
  if (authError || !user || !roles.includes('administrator')) {
    return jsonResponse({ error: 'Chỉ quản trị viên mới có quyền đồng bộ đối soát ApiPay' }, 403);
  }

  if (!accessKey || !secretKey) {
    return jsonResponse(
      {
        error:
          'Chưa cấu hình APIPAY_ACCESS_KEY / APIPAY_SECRET_KEY trong Supabase Edge Function Secrets',
      },
      400,
    );
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const [{ data: settingRow }, { data: syncState }] = await Promise.all([
    serviceClient
      .from('store_settings')
      .select('value')
      .eq('key', 'store_invoice_bank')
      .maybeSingle(),
    serviceClient
      .from('bank_sync_state')
      .select('last_synced_at')
      .eq('provider', 'APIPAY')
      .maybeSingle(),
  ]);

  const expectedAccount = normalizeExpectedAccount(
    settingRow?.value as { vaNumber?: string; bankAccountNumber?: string } | null,
  );

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastSynced = syncState?.last_synced_at
    ? new Date(new Date(syncState.last_synced_at).getTime() - 24 * 60 * 60 * 1000)
    : sevenDaysAgo;
  const fromDate = lastSynced > sevenDaysAgo ? lastSynced : sevenDaysAgo;

  const dateFrom = toVietnamDateString(fromDate);
  const dateTo = toVietnamDateString(now);
  const apipayAuthHeader = buildApiPayAuthHeader(accessKey, secretKey);

  let fetched = 0;
  let matched = 0;
  let partial = 0;
  let overpaid = 0;
  let unmatched = 0;
  let duplicates = 0;
  let rateLimited = false;

  const maxPages = 5;

  for (let page = 1; page <= maxPages; page += 1) {
    if (page > 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const params = new URLSearchParams({
      period: 'custom',
      dateFrom,
      dateTo,
      sortBy: 'transactionDate',
      sortOrder: 'asc',
      page: String(page),
      limit: '100',
    });

    if (expectedAccount) {
      params.set('accountNumber', expectedAccount);
    }

    const res = await fetch(
      `${apipayBaseUrl}/v1/client/metrics/transactions?${params.toString()}`,
      {
        headers: {
          Authorization: apipayAuthHeader,
          'Content-Type': 'application/json',
        },
      },
    );

    if (res.status === 429) {
      rateLimited = true;
      break;
    }

    if (!res.ok) {
      return jsonResponse({ error: `ApiPay API trả về lỗi HTTP ${res.status}` }, 502);
    }

    const body = (await res.json()) as {
      data?: {
        data?: ApiPayMetricsTransaction[];
        meta?: { totalPages?: number };
      };
    };

    const rows = Array.isArray(body?.data?.data) ? body.data.data : [];
    if (rows.length === 0) break;

    for (const tx of rows) {
      if (!tx?.id) continue;
      fetched += 1;

      const transferType = String(tx.type || '').toUpperCase() === 'OUT' ? 'out' : 'in';
      const amount = Math.max(0, Math.round(Number(tx.amount || 0)));
      const paymentCode = extractOrderPaymentCode(tx.content);

      const { data: rpcResult } = await serviceClient.rpc('process_bank_payment', {
        p_provider: 'APIPAY',
        p_external_tx_id: String(tx.id),
        p_gateway: tx.bankAccount?.bankShortName ?? null,
        p_account_number: tx.bankAccount?.accountNumber ?? null,
        p_sub_account: tx.bankAccount?.vaNumber ?? null,
        p_transfer_type: transferType,
        p_amount: amount,
        p_payment_code: paymentCode,
        p_content: typeof tx.content === 'string' ? tx.content : null,
        p_reference_code:
          typeof tx.referenceCode === 'string' && tx.referenceCode.trim() !== ''
            ? tx.referenceCode.trim()
            : null,
        p_transaction_date: toIsoTimestamp(tx.transactionDate),
        p_source: 'RECONCILE_API',
        p_raw_payload: tx,
        p_expected_account_number: expectedAccount || null,
        p_is_sandbox: String(tx.id).startsWith('test_txn_'),
      });

      if (rpcResult?.duplicate) {
        duplicates += 1;
      } else if (rpcResult?.match_status === 'MATCHED') {
        matched += 1;
      } else if (rpcResult?.match_status === 'PARTIAL') {
        partial += 1;
      } else if (rpcResult?.match_status === 'OVERPAID') {
        overpaid += 1;
      } else if (rpcResult?.match_status === 'UNMATCHED') {
        unmatched += 1;
      }
    }

    const totalPages = body?.data?.meta?.totalPages;
    if (rows.length < 100 || (typeof totalPages === 'number' && page >= totalPages)) {
      break;
    }
  }

  await serviceClient.from('bank_sync_state').upsert(
    {
      provider: 'APIPAY',
      last_synced_at: now.toISOString(),
    },
    { onConflict: 'provider' },
  );

  return jsonResponse({
    success: true,
    rateLimited,
    fetched,
    matched,
    partial,
    overpaid,
    unmatched,
    duplicates,
  });
});
