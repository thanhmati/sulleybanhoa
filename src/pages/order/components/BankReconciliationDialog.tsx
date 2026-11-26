import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Link2,
  Loader2,
  RefreshCw,
  Search,
  Landmark,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  useAssignWebhookLogMutation,
  useBankWebhookLogsQuery,
  useIgnoreWebhookLogMutation,
  useTriggerReconcileMutation,
} from '@/hooks/useBankWebhookLogs';
import { useAuthStore } from '@/stores/auth.store';
import { ROLE } from '@/lib/constants/role.constant';
import { ORDER_STATUS } from '@/lib/constants/order.constant';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { formatOrderPaymentCode } from '@/lib/utils/vietqr';
import type { BankWebhookMatchStatus, IBankWebhookLog } from '@/types/bank-webhook';
import type { Order } from '@/types/order';
import { cn } from '@/lib/utils';

interface BankReconciliationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: Order[];
}

type StatusFilter = 'ALL' | BankWebhookMatchStatus;

const STATUS_BADGE_MAP: Record<BankWebhookMatchStatus, { label: string; className: string }> = {
  MATCHED: {
    label: 'Đã khớp',
    className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  },
  PARTIAL: {
    label: 'Chuyển thiếu',
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  },
  OVERPAID: {
    label: 'Chuyển dư / Trùng',
    className: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
  },
  UNMATCHED: {
    label: 'Chưa khớp',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
  IGNORED: {
    label: 'Bỏ qua',
    className: 'bg-muted text-muted-foreground border-border',
  },
  ERROR: {
    label: 'Lỗi',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
};

const SOURCE_LABELS: Record<IBankWebhookLog['source'], string> = {
  WEBHOOK: 'Webhook',
  RECONCILE_API: 'ApiPay API',
  MANUAL_ASSIGN: 'Gắn tay',
};

function maskAccount(acc?: string | null): string {
  if (!acc) return '—';
  const clean = acc.trim();
  if (clean.length <= 4) return clean;
  return `****${clean.slice(-4)}`;
}

export function BankReconciliationDialog({
  open,
  onOpenChange,
  orders,
}: BankReconciliationDialogProps) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = Boolean(user.roles?.includes(ROLE.ADMIN));

  const { data: logs = [], isLoading } = useBankWebhookLogsQuery(open);
  const assignMutation = useAssignWebhookLogMutation();
  const ignoreMutation = useIgnoreWebhookLogMutation();
  const reconcileMutation = useTriggerReconcileMutation();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [assigningLogId, setAssigningLogId] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      ALL: logs.length,
      UNMATCHED: 0,
      PARTIAL: 0,
      OVERPAID: 0,
      MATCHED: 0,
      IGNORED: 0,
      ERROR: 0,
    };
    logs.forEach((log) => {
      counts[log.matchStatus] = (counts[log.matchStatus] || 0) + 1;
    });
    return counts;
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return logs.filter((log) => {
      if (statusFilter !== 'ALL' && log.matchStatus !== statusFilter) return false;
      if (!q) return true;
      return (
        (log.content || '').toLowerCase().includes(q) ||
        (log.paymentCode || '').toLowerCase().includes(q) ||
        (log.referenceCode || '').toLowerCase().includes(q) ||
        (log.matchedOrder?.clientName || '').toLowerCase().includes(q) ||
        (log.matchedOrder?.paymentCode || '').toLowerCase().includes(q)
      );
    });
  }, [logs, statusFilter, searchTerm]);

  // Danh sách đơn hợp lệ để gắn tay (ưu tiên đơn chưa thanh toán đủ)
  const assignableOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return orders
      .filter((order) => order.status !== ORDER_STATUS.CANCELLED)
      .filter((order) => {
        if (!q) return true;
        const payCode = formatOrderPaymentCode(order.orderNumber, order.id).toLowerCase();
        return (
          payCode.includes(q) ||
          (order.orderNumber || '').toLowerCase().includes(q) ||
          (order.client?.name || '').toLowerCase().includes(q) ||
          (order.client?.phoneNumber || '').includes(q)
        );
      })
      .sort((a, b) => {
        if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 25);
  }, [orders, orderSearch]);

  const handleSyncFromProvider = () => {
    reconcileMutation.mutate(undefined, {
      onSuccess: (summary) => {
        toast.success(
          `Đồng bộ xong ${summary.fetched} giao dịch: ${summary.matched} khớp, ${summary.partial} thiếu, ${summary.unmatched} chưa khớp.`,
        );
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Không thể đồng bộ giao dịch từ ApiPay');
      },
    });
  };

  const handleAssignOrder = (logId: string, order: Order) => {
    assignMutation.mutate(
      { logId, orderId: order.id },
      {
        onSuccess: () => {
          const code = formatOrderPaymentCode(order.orderNumber, order.id);
          toast.success(`Đã gắn giao dịch vào đơn ${code}`);
          setAssigningLogId(null);
          setOrderSearch('');
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Gắn giao dịch vào đơn thất bại');
        },
      },
    );
  };

  const handleIgnoreLog = (logId: string) => {
    ignoreMutation.mutate(logId, {
      onSuccess: () => {
        toast.success('Đã đánh dấu bỏ qua giao dịch');
        if (assigningLogId === logId) {
          setAssigningLogId(null);
        }
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Không thể cập nhật trạng thái');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[88vh] flex flex-col">
        <DialogHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-6">
          <div>
            <DialogTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Đối soát giao dịch chuyển khoản (ApiPay)
            </DialogTitle>
            <DialogDescription>
              Theo dõi biến động số dư nhận qua Webhook và gắn tay các giao dịch khách ghi sai nội
              dung.
            </DialogDescription>
          </div>

          {isAdmin && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSyncFromProvider}
              disabled={reconcileMutation.isPending}
              className="gap-2 shrink-0 cursor-pointer"
            >
              <RefreshCw className={cn('h-4 w-4', reconcileMutation.isPending && 'animate-spin')} />
              {reconcileMutation.isPending ? 'Đang đồng bộ...' : 'Đồng bộ từ ApiPay'}
            </Button>
          )}
        </DialogHeader>

        {/* Bộ lọc trạng thái & ô tìm kiếm */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['ALL', 'Tất cả'],
                ['UNMATCHED', 'Chưa khớp'],
                ['PARTIAL', 'Chuyển thiếu'],
                ['MATCHED', 'Đã khớp'],
                ['OVERPAID', 'Chuyển dư / Trùng'],
                ['IGNORED', 'Bỏ qua'],
              ] as [StatusFilter, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer',
                  statusFilter === key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground',
                )}
              >
                {label} ({statusCounts[key] || 0})
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo nội dung chuyển khoản, mã đơn, mã tham chiếu, tên khách..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Danh sách log */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[260px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-14 text-sm text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải lịch sử giao dịch...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-sm text-muted-foreground gap-1.5 border border-dashed rounded-lg">
              <AlertCircle className="h-5 w-5 opacity-60" />
              <span>Không có giao dịch nào phù hợp bộ lọc.</span>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = STATUS_BADGE_MAP[log.matchStatus] || STATUS_BADGE_MAP.UNMATCHED;
              const canAssign =
                isAdmin &&
                !log.orderTransactionId &&
                log.transferType === 'in' &&
                log.amount > 0 &&
                log.matchStatus !== 'IGNORED';
              const isPickingOrder = assigningLogId === log.id;

              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-lg border border-border bg-card space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums',
                            log.transferType === 'in'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-muted-foreground',
                          )}
                        >
                          {log.transferType === 'in' ? '+' : '-'}
                          {formatCurrency(log.amount)}
                        </span>

                        <Badge variant="outline" className={cn('text-[11px]', badge.className)}>
                          {badge.label}
                        </Badge>

                        <Badge variant="secondary" className="text-[10px]">
                          {SOURCE_LABELS[log.source]}
                        </Badge>

                        {log.paymentCode && (
                          <Badge variant="outline" className="text-[11px] font-mono">
                            {log.paymentCode}
                          </Badge>
                        )}

                        {log.isSandbox && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-amber-500/40 text-amber-600 dark:text-amber-400"
                          >
                            Sandbox
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-foreground break-words">
                        <span className="text-muted-foreground">Nội dung: </span>
                        {log.content || '—'}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                        <span>
                          NH: {log.gateway || '—'} ({maskAccount(log.accountNumber)})
                        </span>
                        <span>
                          Thời gian:{' '}
                          {formatDate(log.transactionDate || log.createdAt, 'DD/MM/YYYY HH:mm')}
                        </span>
                        {log.referenceCode && <span>Mã GD: {log.referenceCode}</span>}
                      </div>

                      {log.note && (
                        <p className="text-[11px] text-muted-foreground italic">{log.note}</p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                      {log.matchedOrder && (
                        <div className="text-xs sm:text-right bg-muted/40 px-2.5 py-1.5 rounded border border-border">
                          <div className="flex items-center gap-1 font-semibold text-foreground sm:justify-end">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>
                              {log.matchedOrder.paymentCode} • {log.matchedOrder.clientName}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Còn nợ: {formatCurrency(log.matchedOrder.dueAmount)}
                          </p>
                        </div>
                      )}

                      {canAssign && (
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant={isPickingOrder ? 'secondary' : 'outline'}
                            onClick={() => {
                              setAssigningLogId(isPickingOrder ? null : log.id);
                              setOrderSearch(log.paymentCode || '');
                            }}
                            className="h-7 text-xs gap-1 cursor-pointer"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            {isPickingOrder ? 'Đóng chọn đơn' : 'Gắn vào đơn'}
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={ignoreMutation.isPending}
                            onClick={() => handleIgnoreLog(log.id)}
                            className="h-7 text-xs gap-1 text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Bỏ qua
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Khung tìm & chọn đơn để gắn tay */}
                  {isPickingOrder && (
                    <div className="p-3 rounded-md bg-muted/40 border border-border space-y-2">
                      <Input
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Tìm đơn cần gắn theo mã (ORD...), tên khách hoặc SĐT..."
                        className="h-8 text-xs bg-background"
                      />

                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {assignableOrders.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2 text-center">
                            Không tìm thấy đơn hàng phù hợp
                          </p>
                        ) : (
                          assignableOrders.map((order) => {
                            const payCode = formatOrderPaymentCode(order.orderNumber, order.id);
                            return (
                              <div
                                key={order.id}
                                className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-background border border-border text-xs"
                              >
                                <div className="min-w-0">
                                  <span className="font-semibold font-mono">{payCode}</span>
                                  <span className="mx-1.5 text-muted-foreground">•</span>
                                  <span>{order.client?.name || 'Khách lẻ'}</span>
                                  <span className="mx-1.5 text-muted-foreground">•</span>
                                  <span
                                    className={
                                      order.dueAmount > 0
                                        ? 'text-amber-600 dark:text-amber-400 font-medium'
                                        : 'text-emerald-600'
                                    }
                                  >
                                    {order.dueAmount > 0
                                      ? `Nợ ${formatCurrency(order.dueAmount)}`
                                      : 'Đã đủ'}
                                  </span>
                                </div>

                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={assignMutation.isPending}
                                  onClick={() => handleAssignOrder(log.id, order)}
                                  className="h-6 px-2.5 text-[11px] shrink-0 cursor-pointer"
                                >
                                  Gắn
                                </Button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
