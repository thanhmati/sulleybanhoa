import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/DataTable';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Button } from '@/components/ui/button';
import { useDeleteOrder, useOrdersQuery } from '@/hooks/useOrders';
import { orderColumns } from './components/columns';
import { PlusCircleIcon, Table as TableIcon, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { OrderFormDialog } from './components/OrderFormDialog';
import { OrderReceiptDialog } from './components/OrderReceiptDialog';
import { OrderDeliveryCalendar } from './components/OrderDeliveryCalendar';
import { OrderFloristTimeline } from './components/OrderFloristTimeline';
import { Order } from '@/types/order';
import { toast } from 'sonner';
import { OrderFilters } from './components/OrderFilters';
import { OrderSummaryCards } from './components/OrderSummaryCards';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

type OrderViewMode = 'table' | 'calendar' | 'timeline';

export default function OrderListPage() {
  const { data, isLoading } = useOrdersQuery();
  const deleteOrder = useDeleteOrder();

  const [open, setOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

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

  const handleEdit = (order: Order) => {
    navigate(`/admin/orders/${order.id}`);
  };

  const handleDelete = (orderId: string) => {
    deleteOrder.mutate(orderId, {
      onSuccess: () => {
        toast.success('Xoá đơn hàng thành công!');
      },
      onError: () => toast.error('Không thể xoá đơn hàng này'),
    });
  };

  const handleSelectDateFromCalendar = (dateStr: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', 'timeline');
      next.set('date', dateStr);
      return next;
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
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
          isLoading={isLoading}
          columns={orderColumns(handleEdit, handleDelete)}
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
      <OrderReceiptDialog
        open={!!receiptOrder}
        onOpenChange={(isOpen) => !isOpen && setReceiptOrder(null)}
        order={receiptOrder || undefined}
      />
    </div>
  );
}
