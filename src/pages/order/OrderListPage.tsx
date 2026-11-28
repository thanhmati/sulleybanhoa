import { useCallback, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/DataTable';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Button } from '@/components/ui/button';
import { useDeleteOrder, useOrdersQuery } from '@/hooks/useOrders';
import { orderColumns } from './components/columns';
import {
  PlusCircleIcon,
  Table as TableIcon,
  Calendar as CalendarIcon,
  Clock,
  Flower2,
  Landmark,
} from 'lucide-react';
import { OrderFormDialog } from './components/OrderFormDialog';
import { OrderReceiptDialog } from './components/OrderReceiptDialog';
import { OrderDeliveryCalendar } from './components/OrderDeliveryCalendar';
import { OrderFloristTimeline } from './components/OrderFloristTimeline';
import { FlowerImportDialog } from './components/FlowerImportDialog';
import { BankReconciliationDialog } from './components/BankReconciliationDialog';
import { useFlowerTypesQuery } from '@/hooks/useFlowerTypes';
import { useBankWebhookLogsQuery, useOrderPaymentRealtime } from '@/hooks/useBankWebhookLogs';
import { Order } from '@/types/order';
import { toast } from 'sonner';
import { OrderFilters } from './components/OrderFilters';
import { OrderSummaryCards } from './components/OrderSummaryCards';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

type OrderViewMode = 'table' | 'calendar' | 'timeline';

export default function OrderListPage() {
  useOrderPaymentRealtime();

  const { data, isLoading } = useOrdersQuery();
  const { mutate: deleteOrderMutate } = useDeleteOrder();
  const { data: webhookLogs = [] } = useBankWebhookLogsQuery();

  const [open, setOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isReconcileOpen, setIsReconcileOpen] = useState(false);
  const { data: flowerTypes = [] } = useFlowerTypesQuery();
  const navigate = useNavigate();

  const pendingReconcileCount = useMemo(
    () =>
      webhookLogs.filter(
        (log) =>
          log.matchStatus === 'UNMATCHED' ||
          (log.matchStatus === 'PARTIAL' && !log.orderTransactionId && !log.matchedOrderId),
      ).length,
    [webhookLogs],
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = (searchParams.get('view') as OrderViewMode) || 'table';
  const selectedDate = searchParams.get('date') || dayjs().format('YYYY-MM-DD');

  const setView = (view: OrderViewMode) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', view);
      return next;
    });
  };

  const setSelectedDate = (date: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('date', date);
      return next;
    });
  };

  const handleCreate = () => {
    setOpen(true);
  };

  const handleEdit = useCallback(
    (order: Order) => {
      navigate(`/admin/orders/${order.id}`);
    },
    [navigate],
  );

  const handleDelete = useCallback(
    (orderId: string) => {
      deleteOrderMutate(orderId, {
        onSuccess: () => {
          toast.success('Xoá đơn hàng thành công!');
        },
        onError: () => toast.error('Không thể xoá đơn hàng này'),
      });
    },
    [deleteOrderMutate],
  );

  const columns = useMemo(() => orderColumns(handleEdit, handleDelete), [handleEdit, handleDelete]);

  const handleSelectDateFromCalendar = (dateStr: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', 'timeline');
      next.set('date', dateStr);
      return next;
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 w-full min-w-0 max-w-full">
      {/* 🏷️ Header trang & Bộ chuyển đổi View (Multi-View Switcher) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý đơn hàng</h2>
          <p className="text-muted-foreground text-sm">
            Điều phối giao hoa, theo dõi tiến độ cắm hoa và quản lý đơn hàng
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Segmented Control chuyển đổi View */}
          <div className="flex items-center rounded-lg border bg-muted/60 p-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => setView('table')}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer',
                currentView === 'table'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'hover:text-foreground',
              )}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Bảng dữ liệu</span>
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer',
                currentView === 'calendar'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'hover:text-foreground',
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Lịch giao hoa</span>
            </button>
            <button
              type="button"
              onClick={() => setView('timeline')}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer',
                currentView === 'timeline'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'hover:text-foreground',
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Tiến độ trong ngày</span>
            </button>
          </div>

          {/* Nút Đối soát chuyển khoản ApiPay */}
          <Button
            variant="outline"
            onClick={() => setIsReconcileOpen(true)}
            className="cursor-pointer gap-2 relative"
          >
            <Landmark className="h-4 w-4 text-primary" />
            <span>Đối soát CK</span>
            {pendingReconcileCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold bg-destructive text-destructive-foreground">
                {pendingReconcileCount}
              </span>
            )}
          </Button>

          {/* Nút Xem hoa cần nhập */}
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
            className="cursor-pointer gap-2"
          >
            <Flower2 className="h-4 w-4 text-primary" />
            <span>Hoa cần nhập</span>
          </Button>

          {/* Nút Tạo đơn hàng luôn sẵn sàng ở mọi View */}
          <Button onClick={handleCreate} className="cursor-pointer">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Tạo đơn hàng
          </Button>
        </div>
      </div>

      {/* 🔀 Nội dung theo từng chế độ xem */}
      {currentView === 'table' && (
        <DataTable
          storageKey="orders"
          isLoading={isLoading}
          columns={columns}
          data={data || []}
          topContent={(table) => <OrderSummaryCards table={table} isLoading={isLoading} />}
          externalState={{
            sorting: [
              { id: 'status', desc: false },
              { id: 'orderNumber', desc: true },
            ],
            columnVisibility: { orderNumber: false },
          }}
          toolbar={(table) => (
            <DataTableToolbar actions={null} filters={<OrderFilters table={table} />} />
          )}
        />
      )}

      {currentView === 'calendar' && (
        <OrderDeliveryCalendar
          orders={data || []}
          isLoading={isLoading}
          onSelectDate={handleSelectDateFromCalendar}
          onEditOrder={handleEdit}
          onOpenReceipt={(order) => setReceiptOrder(order)}
        />
      )}

      {currentView === 'timeline' && (
        <OrderFloristTimeline
          orders={data || []}
          isLoading={isLoading}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onEditOrder={handleEdit}
          onOpenReceipt={(order) => setReceiptOrder(order)}
        />
      )}

      {/* Modal tạo đơn hàng */}
      <OrderFormDialog open={open} onOpenChange={setOpen} />

      {/* Modal in hoá đơn / phiếu giao hoa dùng chung */}
      {receiptOrder && (
        <OrderReceiptDialog
          open={!!receiptOrder}
          onOpenChange={(isOpen) => !isOpen && setReceiptOrder(null)}
          order={receiptOrder}
        />
      )}

      {/* Modal danh sách hoa cần nhập */}
      <FlowerImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        orders={data || []}
        flowerTypes={flowerTypes}
        initialDate={selectedDate}
      />

      {/* Modal đối soát giao dịch ngân hàng ApiPay */}
      {isReconcileOpen && (
        <BankReconciliationDialog
          open={isReconcileOpen}
          onOpenChange={setIsReconcileOpen}
          orders={data || []}
        />
      )}
    </div>
  );
}
