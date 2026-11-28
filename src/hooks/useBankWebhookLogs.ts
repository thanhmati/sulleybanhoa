import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { bankWebhookService } from '@/services/bankWebhookService';
import type { IBankWebhookLog } from '@/types/bank-webhook';

export const BANK_WEBHOOK_LOGS_QUERY_KEY = ['bank_webhook_logs'] as const;

export function useBankWebhookLogsQuery(enabled = true) {
  return useQuery<IBankWebhookLog[]>({
    queryKey: BANK_WEBHOOK_LOGS_QUERY_KEY,
    queryFn: bankWebhookService.getLogs,
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useAssignWebhookLogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      logId,
      orderId,
      asDeposit,
    }: {
      logId: string;
      orderId: string;
      asDeposit?: boolean;
    }) => bankWebhookService.assignLogToOrder(logId, orderId, asDeposit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_WEBHOOK_LOGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order_detail'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}

export function useIgnoreWebhookLogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => bankWebhookService.ignoreLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_WEBHOOK_LOGS_QUERY_KEY });
    },
  });
}

export function useTriggerReconcileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankWebhookService.triggerReconcile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_WEBHOOK_LOGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order_detail'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}

function formatShortVnd(amount: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(amount))} đ`;
}

/**
 * Lắng nghe Supabase Realtime cho order_transactions và bank_webhook_logs
 * để tự động đồng bộ UI đơn hàng & thông báo ngay khi nhận được chuyển khoản.
 */
export function useOrderPaymentRealtime() {
  const queryClient = useQueryClient();
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const channel = supabase
      .channel('order-payments-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_transactions' }, () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['order_detail'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bank_webhook_logs' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: BANK_WEBHOOK_LOGS_QUERY_KEY });
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['order_detail'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });

          if (payload.eventType !== 'UPDATE' || !payload.new) return;

          const row = payload.new as {
            id?: string;
            amount?: number;
            payment_code?: string | null;
            match_status?: string;
            source?: string;
          };

          if (!row.id || !row.match_status || row.source === 'MANUAL_ASSIGN') return;

          const dedupeKey = `${row.id}:${row.match_status}`;
          if (notifiedRef.current.has(dedupeKey)) return;
          notifiedRef.current.add(dedupeKey);

          const formattedAmount = formatShortVnd(Number(row.amount || 0));
          const codeLabel = row.payment_code ? ` (${row.payment_code})` : '';

          if (row.match_status === 'MATCHED') {
            toast.success(`Đã nhận chuyển khoản ${formattedAmount}${codeLabel}`);
          } else if (row.match_status === 'PARTIAL') {
            toast.info(`Đã nhận cọc/thanh toán một phần ${formattedAmount}${codeLabel}`);
          } else if (row.match_status === 'OVERPAID') {
            toast.warning(`Nhận chuyển khoản dư ${formattedAmount}${codeLabel}, vui lòng kiểm tra`);
          } else if (row.match_status === 'UNMATCHED') {
            toast.warning(`Có giao dịch ${formattedAmount} chưa khớp mã đơn — xem mục Đối soát CK`);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
