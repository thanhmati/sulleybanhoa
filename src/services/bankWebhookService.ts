import { supabase } from '@/lib/supabase';
import type { IBankReconcileSummary, IBankWebhookLog } from '@/types/bank-webhook';

export function mapBankWebhookLogFromDb(row: any): IBankWebhookLog {
  const matched = row.matched_order;
  return {
    id: row.id,
    provider: row.provider,
    externalTxId: row.external_tx_id ?? null,
    gateway: row.gateway ?? null,
    accountNumber: row.account_number ?? null,
    subAccount: row.sub_account ?? null,
    transferType: row.transfer_type === 'out' ? 'out' : 'in',
    amount: Number(row.amount || 0),
    paymentCode: row.payment_code ?? null,
    content: row.content ?? null,
    referenceCode: row.reference_code ?? null,
    transactionDate: row.transaction_date ?? null,
    matchedOrderId: row.matched_order_id ?? null,
    orderTransactionId: row.order_transaction_id ?? null,
    matchStatus: row.match_status,
    webhookSuccess: Boolean(row.webhook_success),
    isSandbox: Boolean(row.is_sandbox),
    source: row.source,
    note: row.note ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    matchedOrder: matched
      ? {
          id: matched.id,
          orderNumber: matched.order_number,
          paymentCode: matched.payment_code,
          clientName: matched.client_name,
          dueAmount: Number(matched.due_amount || 0),
          isPaid: Boolean(matched.is_paid),
          status: matched.status,
        }
      : null,
  };
}

export const bankWebhookService = {
  getLogs: async (): Promise<IBankWebhookLog[]> => {
    const { data, error } = await supabase
      .from('bank_webhook_logs')
      .select(
        'id, provider, external_tx_id, gateway, account_number, sub_account, transfer_type, amount, payment_code, content, reference_code, transaction_date, matched_order_id, order_transaction_id, match_status, webhook_success, is_sandbox, source, note, created_at, updated_at, matched_order:orders(id, order_number, payment_code, client_name, due_amount, is_paid, status)',
      )
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;
    return (data || []).map(mapBankWebhookLogFromDb);
  },

  assignLogToOrder: async (
    logId: string,
    orderId: string,
    asDeposit?: boolean,
  ): Promise<string> => {
    const { data, error } = await supabase.rpc('reconcile_bank_log_to_order', {
      p_log_id: logId,
      p_order_id: orderId,
      p_as_deposit: asDeposit ?? null,
    });

    if (error) throw error;
    return data as string;
  },

  ignoreLog: async (logId: string): Promise<void> => {
    const { error } = await supabase
      .from('bank_webhook_logs')
      .update({
        match_status: 'IGNORED',
        note: 'Đã bỏ qua bởi quản trị viên',
      })
      .eq('id', logId);

    if (error) throw error;
  },

  triggerReconcile: async (): Promise<IBankReconcileSummary> => {
    const { data, error } = await supabase.functions.invoke<IBankReconcileSummary>(
      'apipay-reconcile',
      { method: 'POST' },
    );

    if (error) {
      throw new Error(error.message || 'Không thể đồng bộ giao dịch từ ApiPay');
    }

    if (!data) {
      throw new Error('Không nhận được phản hồi từ hàm đối soát ApiPay');
    }

    return data;
  },
};
