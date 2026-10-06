import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';
import { ORDER_STATUS } from '@/lib/constants/order.constant';
import { formatCurrency } from '@/lib/utils/formatters';
import dayjs, { Dayjs } from 'dayjs';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderDeliveryCalendarProps {
  orders: Order[];
  isLoading?: boolean;
  onSelectDate: (dateStr: string) => void;
  onEditOrder: (order: Order) => void;
  onOpenReceipt: (order: Order) => void;
}

const WEEKDAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

export function OrderDeliveryCalendar({
  orders,
  isLoading,
  onSelectDate,
  onEditOrder,
}: OrderDeliveryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().startOf('month'));
  const [statusFilter, setStatusFilter] = useState<'ALL' | ORDER_STATUS>('ALL');

  // Điều hướng tháng
  const handlePrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth((prev) => prev.add(1, 'month'));
  const handleToday = () => setCurrentMonth(dayjs().startOf('month'));

  // Lọc đơn hàng theo status filter
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // Gom nhóm đơn hàng theo ngày 'YYYY-MM-DD'
  const ordersByDate = useMemo(() => {
    const map = new Map<string, Order[]>();
    filteredOrders.forEach((order) => {
      if (!order.deliveryDate) return;
      const dateKey = dayjs(order.deliveryDate).format('YYYY-MM-DD');
      const list = map.get(dateKey) || [];
      list.push(order);
      map.set(dateKey, list);
    });
    // Sắp xếp đơn trong ngày theo giờ giao
    map.forEach((list) => {
      list.sort((a, b) => (a.deliveryTime || '').localeCompare(b.deliveryTime || ''));
    });
    return map;
  }, [filteredOrders]);

  // Thống kê trong tháng hiện tại
  const monthStats = useMemo(() => {
    const start = currentMonth.startOf('month');
    const end = currentMonth.endOf('month');
    const ordersInMonth = orders.filter((o) => {
      if (!o.deliveryDate) return false;
      const d = dayjs(o.deliveryDate);
      return d.isAfter(start.subtract(1, 'second')) && d.isBefore(end.add(1, 'second'));
    });

    const pending = ordersInMonth.filter((o) => o.status === ORDER_STATUS.PENDING).length;
    const delivered = ordersInMonth.filter((o) => o.status === ORDER_STATUS.DELIVERED).length;
    const cancelled = ordersInMonth.filter(
      (o) => o.status === ORDER_STATUS.CANCELLED || o.status === ORDER_STATUS.RETURNED,
    ).length;
    const totalRev = ordersInMonth
      .filter((o) => o.status !== ORDER_STATUS.CANCELLED)
      .reduce((sum, o) => sum + (Number(o.price) || 0) + (Number(o.ship) || 0), 0);

    return {
      total: ordersInMonth.length,
      pending,
      delivered,
      cancelled,
      totalRev,
    };
  }, [orders, currentMonth]);

  // Tính toán lưới lịch (thứ 2 đến chủ nhật)
  const calendarCells = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');

    // 0 = CN, 1 = T2, ... -> đổi sang 0 = T2, ..., 6 = CN
    const startDayOfWeek = (startOfMonth.day() + 6) % 7;
    const totalDaysInMonth = currentMonth.daysInMonth();

    const cells: {
      date: Dayjs;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      orders: Order[];
    }[] = [];

    // Các ngày tháng trước để đệm tuần
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = startOfMonth.subtract(i + 1, 'day');
      const dateStr = d.format('YYYY-MM-DD');
      cells.push({
        date: d,
        dateStr,
        isCurrentMonth: false,
        isToday: d.isSame(dayjs(), 'day'),
        orders: ordersByDate.get(dateStr) || [],
      });
    }

    // Các ngày trong tháng hiện tại
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = currentMonth.date(i);
      const dateStr = d.format('YYYY-MM-DD');
      cells.push({
        date: d,
        dateStr,
        isCurrentMonth: true,
        isToday: d.isSame(dayjs(), 'day'),
        orders: ordersByDate.get(dateStr) || [],
      });
    }

    // Các ngày tháng sau để đủ tuần (bội số của 7)
    const remainingDays = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const d = endOfMonth.add(i, 'day');
      const dateStr = d.format('YYYY-MM-DD');
      cells.push({
        date: d,
        dateStr,
        isCurrentMonth: false,
        isToday: d.isSame(dayjs(), 'day'),
        orders: ordersByDate.get(dateStr) || [],
      });
    }

    return cells;
  }, [currentMonth, ordersByDate]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground border rounded-xl bg-card">
        Đang tải dữ liệu lịch giao hoa...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🧭 Thanh điều hướng tháng & Thống kê nhanh */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-xs">
        {/* Bộ chọn tháng */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 cursor-pointer"
            onClick={handlePrevMonth}
            title="Tháng trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background font-semibold text-sm min-w-[160px] justify-center shadow-2xs">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>Tháng {currentMonth.format('MM/YYYY')}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 cursor-pointer"
            onClick={handleNextMonth}
            title="Tháng sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-9 cursor-pointer"
            onClick={handleToday}
          >
            Hôm nay
          </Button>
        </div>

        {/* Chỉ số nhanh của tháng */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 text-xs">
            <span className="text-muted-foreground">Tổng đơn:</span>
            <span className="font-bold text-foreground">{monthStats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Chờ giao:</span>
            <span className="font-bold">{monthStats.pending}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Đã giao:</span>
            <span className="font-bold">{monthStats.delivered}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Doanh thu tháng:</span>
            <span className="font-bold">{formatCurrency(monthStats.totalRev)}</span>
          </div>
        </div>

        {/* Lọc trạng thái trong lịch */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg self-start lg:self-auto text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={cn(
              'px-2.5 py-1 rounded-md transition-colors cursor-pointer',
              statusFilter === 'ALL'
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter(ORDER_STATUS.PENDING)}
            className={cn(
              'px-2.5 py-1 rounded-md transition-colors cursor-pointer',
              statusFilter === ORDER_STATUS.PENDING
                ? 'bg-background text-amber-600 dark:text-amber-400 shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Chờ giao ({monthStats.pending})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter(ORDER_STATUS.DELIVERED)}
            className={cn(
              'px-2.5 py-1 rounded-md transition-colors cursor-pointer',
              statusFilter === ORDER_STATUS.DELIVERED
                ? 'bg-background text-emerald-600 dark:text-emerald-400 shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Đã giao
          </button>
        </div>
      </div>

      {/* 📅 Lưới Lịch 7 ngày */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        {/* Tiêu đề thứ trong tuần */}
        <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-semibold text-muted-foreground py-2.5">
          {WEEKDAYS.map((day, idx) => (
            <div key={day} className={cn(idx >= 5 && 'text-primary font-bold')}>
              {day}
            </div>
          ))}
        </div>

        {/* Ô ngày */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y border-b">
          {calendarCells.map((cell) => {
            const hasOrders = cell.orders.length > 0;
            const pendingCount = cell.orders.filter(
              (o) => o.status === ORDER_STATUS.PENDING,
            ).length;

            return (
              <div
                key={cell.dateStr}
                onClick={() => onSelectDate(cell.dateStr)}
                className={cn(
                  'min-h-[120px] sm:min-h-[140px] p-2 flex flex-col justify-between transition-colors cursor-pointer group hover:bg-muted/30 relative',
                  !cell.isCurrentMonth && 'bg-muted/15 opacity-40',
                  cell.isToday && 'bg-primary/5 ring-1 ring-primary/40 ring-inset',
                )}
              >
                {/* Header ngày */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={cn(
                      'text-xs font-semibold inline-flex items-center justify-center h-6 w-6 rounded-full transition-transform',
                      cell.isToday
                        ? 'bg-primary text-primary-foreground font-bold scale-105'
                        : cell.isCurrentMonth
                          ? 'text-foreground group-hover:text-primary'
                          : 'text-muted-foreground',
                    )}
                  >
                    {cell.date.format('DD')}
                  </span>

                  {hasOrders && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] h-5 px-1.5 font-bold',
                        pendingCount > 0
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
                      )}
                    >
                      {cell.orders.length} đơn
                    </Badge>
                  )}
                </div>

                {/* Danh sách chip đơn hàng preview */}
                <div className="flex-1 space-y-1 overflow-hidden">
                  {cell.orders.slice(0, 2).map((order) => {
                    const isDelivered = order.status === ORDER_STATUS.DELIVERED;
                    const isCancelled =
                      order.status === ORDER_STATUS.CANCELLED ||
                      order.status === ORDER_STATUS.RETURNED;

                    return (
                      <div
                        key={order.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditOrder(order);
                        }}
                        className={cn(
                          'text-[11px] px-1.5 py-1 rounded truncate border flex items-center justify-between gap-1 transition-all hover:scale-[1.02] shadow-2xs',
                          isDelivered
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50'
                            : isCancelled
                              ? 'bg-destructive/10 text-destructive border-destructive/20 line-through opacity-70'
                              : 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 font-medium',
                        )}
                        title={`${order.deliveryTime || 'Chưa có giờ'} - ${order.client?.name} (${order.type}) - ${order.tone}`}
                      >
                        <span className="truncate">
                          <span className="font-bold mr-1">{order.deliveryTime || '—'}</span>
                          {order.client?.name || 'Khách'}
                        </span>
                        <span className="text-[10px] opacity-70 shrink-0 font-sans">
                          {order.tone}
                        </span>
                      </div>
                    );
                  })}

                  {cell.orders.length > 2 && (
                    <div className="text-[10px] text-muted-foreground font-medium px-1 flex items-center justify-between">
                      <span>+{cell.orders.length - 2} đơn khác</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                {/* Footer ô ngày: Gợi ý xem tiến độ */}
                <div className="pt-1 mt-1 border-t border-border/40 text-[10px] text-muted-foreground flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-primary font-medium flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> Xem tiến độ
                  </span>
                  <span>{cell.date.format('DD/MM')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
