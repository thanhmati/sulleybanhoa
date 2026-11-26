/* global Deno */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { normalizeExpectedAccount, toVietnamIsoTimestamp } from '../_shared/sepay.ts';

interface SePayApiTransaction {
  id: string;
  bank_brand_name?: string;
  account_number?: string;
  va?: string | null;
  transaction_date?: string;
  amount_in?: number | string;
  amount_out?: number | string;
  transaction_content?: string;
  reference_number?: string | null;
  code?: string | null;
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

function formatDateParam(date: Date): string {
  const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return vnTime.toISOString().slice(0, 19).replace('T', ' ');
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
  const sepayApiToken = (Deno.env.get('SEPAY_API_TOKEN') || '').trim();
  const sepayBaseUrl = (
    Deno.env.get('SEPAY_API_BASE_URL') || 'https://userapi.sepay.vn/v2'
  ).replace(/\/$/, '');

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
    return jsonResponse({ error: 'Chỉ quản trị viên mới có quyền đồng bộ đối soát SePay' }, 403);
  }

  if (!sepayApiToken) {
    return jsonResponse(
      { error: 'Chưa cấu hình SEPAY_API_TOKEN trong Supabase Edge Function Secrets' },
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
      .select('last_sepay_api_id')
      .eq('provider', 'SEPAY')
      .maybeSingle(),
  ]);

  const expectedAccount = normalizeExpectedAccount(
    settingRow?.value as { vaNumber?: string; bankAccountNumber?: string } | null,
  );

  const initialCursorId = syncState?.last_sepay_api_id || null;
  let newestApiId: string | null = initialCursorId;
  let fetched = 0;
  let matched = 0;
  let partial = 0;
  let overpaid = 0;
  let unmatched = 0;
  let duplicates = 0;
  let rateLimited = false;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const maxPages = 5;

  for (let page = 1; page <= maxPages; page += 1) {
    if (page > 1) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    const params = new URLSearchParams({
      per_page: '100',
      page: String(page),
      transaction_date_sort: 'asc',
      timestamp_format: 'iso8601',
    });
    if (initialCursorId) {
      params.set('since_id', initialCursorId);
    } else {
      params.set('transaction_date_from', formatDateParam(sevenDaysAgo));
    }

    const res = await fetch(`${sepayBaseUrl}/transactions?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${sepayApiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 429) {
      rateLimited = true;
      break;
    }

    if (!res.ok) {
      return jsonResponse({ error: `SePay API trả về lỗi HTTP ${res.status}` }, 502);
    }

    const body = (await res.json()) as {
      data?: SePayApiTransaction[];
      transactions?: SePayApiTransaction[];
    };
    const rows = Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body?.transactions)
        ? body.transactions
        : [];

    if (rows.length === 0) break;

    for (const tx of rows) {
      fetched += 1;
      const amountIn = Math.round(Number(tx.amount_in || 0));
      const amountOut = Math.round(Number(tx.amount_out || 0));
      const isMoneyIn = amountIn > 0;
      const amount = isMoneyIn ? amountIn : amountOut;

      const { data: rpcResult } = await serviceClient.rpc('process_sepay_payment', {
        p_provider: 'SEPAY',
        p_external_tx_id: null,
        p_sepay_api_id: String(tx.id),
        p_gateway: tx.bank_brand_name ?? null,
        p_account_number: tx.account_number ?? null,
        p_sub_account: tx.va ?? null,
        p_transfer_type: isMoneyIn ? 'in' : 'out',
        p_amount: Math.max(0, amount),
        p_payment_code:
          typeof tx.code === 'string' && tx.code.trim() !== '' ? tx.code.trim() : null,
        p_content: typeof tx.transaction_content === 'string' ? tx.transaction_content : null,
        p_reference_code:
          typeof tx.reference_number === 'string' && tx.reference_number.trim() !== ''
            ? tx.reference_number.trim()
            : null,
        p_transaction_date: toVietnamIsoTimestamp(tx.transaction_date),
        p_source: 'RECONCILE_API',
        p_raw_payload: tx,
        p_expected_account_number: expectedAccount || null,
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

    const lastRow = rows[rows.length - 1];
    if (lastRow?.id) {
      newestApiId = String(lastRow.id);
    }

    if (rows.length < 100) break;
  }

  if (newestApiId) {
    await serviceClient.from('bank_sync_state').upsert(
      {
        provider: 'SEPAY',
        last_sepay_api_id: newestApiId,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: 'provider' },
    );
  }

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
