import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Order } from '@/types/order';
import { ORDER_STATUS } from '@/lib/constants/order.constant';
import { formatCurrency } from '@/lib/utils/formatters';
import { useUpdateOrderStatus } from '@/hooks/useOrders';
import { EditableStatusBadge } from './EditableStatusBadge';
import dayjs from 'dayjs';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  FileText,
  Printer,
  Pencil,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  HelpCircle,
  Truck,
  DollarSign,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { vi as viLocale } from 'react-day-picker/locale';

interface OrderFloristTimelineProps {
  orders: Order[];
  isLoading?: boolean;
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (dateStr: string) => void;
  onEditOrder: (order: Order) => void;
  onOpenReceipt: (order: Order) => void;
}

// Phân tích giờ từ chuỗi (ví dụ: '08:30', '9h', '14:00', '16h30')
function parseHourFromDeliveryTime(timeStr?: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2})([:hH]|\s|$)/);
  if (match) {
    const hour = parseInt(match[1], 10);
    if (!isNaN(hour) && hour >= 0 && hour <= 23) {
      return hour;
    }
  }
  return null;
}

interface TimeSlotDef {
  id: string;
  title: string;
  timeRange: string;
  icon: any;
  colorClass: string;
  filter: (hour: number | null) => boolean;
}

const TIME_SLOTS: TimeSlotDef[] = [
  {
    id: 'early_morning',
    title: 'Sáng sớm',
    timeRange: 'Trước 09:00',
    icon: Sunrise,
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-200 dark:border-amber-900',
    filter: (h) => h !== null && h < 9,
  },
  {
    id: 'morning',
    title: 'Buổi sáng (Cao điểm)',
    timeRange: '09:00 - 12:00',
    icon: Sun,
    colorClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-200 dark:border-yellow-900',
    filter: (h) => h !== null && h >= 9 && h < 12,
  },
  {
    id: 'afternoon',
    title: 'Buổi trưa - Chiều',
    timeRange: '12:00 - 15:00',
    icon: Sun,
    colorClass: 'text-orange-500 bg-orange-500/10 border-orange-200 dark:border-orange-900',
    filter: (h) => h !== null && h >= 12 && h < 15,
  },
  {
    id: 'late_afternoon',
    title: 'Chiều muộn (Tan tầm)',
    timeRange: '15:00 - 18:00',
    icon: Sunset,
    colorClass: 'text-rose-500 bg-rose-500/10 border-rose-200 dark:border-rose-900',
    filter: (h) => h !== null && h >= 15 && h < 18,
  },
  {
    id: 'evening',
    title: 'Buổi tối',
    timeRange: 'Sau 18:00',
    icon: Moon,
    colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-200 dark:border-indigo-900',
    filter: (h) => h !== null && h >= 18,
  },
  {
    id: 'unspecified',
    title: 'Chưa hẹn giờ cụ thể',
    timeRange: 'Cần xác nhận',
    icon: HelpCircle,
    colorClass: 'text-muted-foreground bg-muted border-border',
    filter: (h) => h === null,
  },
];

export function OrderFloristTimeline({
  orders,
  isLoading,
  selectedDate,
  onDateChange,
  onEditOrder,
  onOpenReceipt,
}: OrderFloristTimelineProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | ORDER_STATUS>('ALL');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const currentDate = dayjs(selectedDate).isValid() ? dayjs(selectedDate) : dayjs();
  const updateOrderStatus = useUpdateOrderStatus();

  // Chuyển ngày
  const handlePrevDay = () => onDateChange(currentDate.subtract(1, 'day').format('YYYY-MM-DD'));
  const handleNextDay = () => onDateChange(currentDate.add(1, 'day').format('YYYY-MM-DD'));
  const handleToday = () => onDateChange(dayjs().format('YYYY-MM-DD'));

  // Lọc danh sách đơn trong ngày được chọn
  const dayOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!o.deliveryDate) return false;
      return dayjs(o.deliveryDate).format('YYYY-MM-DD') === selectedDate;
    });
  }, [orders, selectedDate]);

  // Áp dụng bộ lọc trạng thái
  const filteredDayOrders = useMemo(() => {
    if (statusFilter === 'ALL') return dayOrders;
    return dayOrders.filter((o) => o.status === statusFilter);
  }, [dayOrders, statusFilter]);

  // Thống kê nhanh trong ngày
  const dayStats = useMemo(() => {
    const total = dayOrders.length;
    const pending = dayOrders.filter((o) => o.status === ORDER_STATUS.PENDING).length;
    const delivered = dayOrders.filter((o) => o.status === ORDER_STATUS.DELIVERED).length;
    const cancelled = dayOrders.filter(
      (o) => o.status === ORDER_STATUS.CANCELLED || o.status === ORDER_STATUS.RETURNED,
    ).length;

    const totalPrice = dayOrders
      .filter((o) => o.status !== ORDER_STATUS.CANCELLED)
      .reduce((sum, o) => sum + (Number(o.price) || 0) + (Number(o.ship) || 0), 0);

    const totalDue = dayOrders
      .filter((o) => o.status !== ORDER_STATUS.CANCELLED)
      .reduce((sum, o) => sum + (Number(o.dueAmount) || 0), 0);

    return { total, pending, delivered, cancelled, totalPrice, totalDue };
  }, [dayOrders]);

  // Gom đơn vào các Time Slots
  const ordersBySlot = useMemo(() => {
    const slotMap = new Map<string, Order[]>();
    TIME_SLOTS.forEach((slot) => slotMap.set(slot.id, []));

    filteredDayOrders.forEach((order) => {
      const hour = parseHourFromDeliveryTime(order.deliveryTime);
      const matchedSlot = TIME_SLOTS.find((s) => s.filter(hour));
      const slotId = matchedSlot ? matchedSlot.id : 'unspecified';
      const list = slotMap.get(slotId) || [];
      list.push(order);
      slotMap.set(slotId, list);
    });

    // Sắp xếp đơn trong từng slot theo giờ giao
    slotMap.forEach((list) => {
      list.sort((a, b) => (a.deliveryTime || '').localeCompare(b.deliveryTime || ''));
    });

    return slotMap;
  }, [filteredDayOrders]);

  // Nhanh chóng đánh dấu đơn đã giao
  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus.mutate(
      { id: orderId, status: ORDER_STATUS.DELIVERED },
      {
        onSuccess: () => toast.success('Đã cập nhật trạng thái: Đã giao hoa!'),
        onError: () => toast.error('Không thể cập nhật trạng thái đơn'),
      },
    );
  };

  const isToday = currentDate.isSame(dayjs(), 'day');

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground border rounded-xl bg-card">
        Đang tải tiến độ cắm và giao hoa...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🧭 Thanh điều hướng ngày & Thống kê nhanh */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-xs">
        {/* Bộ chọn ngày */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 cursor-pointer"
            onClick={handlePrevDay}
            title="Ngày trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Popover chọn ngày trực tiếp */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 font-semibold text-sm min-w-[210px] justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span>
                    {currentDate.format('dddd, DD/MM/YYYY').replace(/^./, (s) => s.toUpperCase())}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar
                mode="single"
                selected={currentDate.toDate()}
                onSelect={(d) => {
                  if (d) {
                    onDateChange(dayjs(d).format('YYYY-MM-DD'));
                    setCalendarOpen(false);
                  }
                }}
                locale={viLocale}
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 cursor-pointer"
            onClick={handleNextDay}
            title="Ngày sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {!isToday && (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-9 cursor-pointer"
              onClick={handleToday}
            >
              Hôm nay
            </Button>
          )}
        </div>

        {/* Thống kê đơn trong ngày */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 text-xs">
            <span className="text-muted-foreground">Tổng đơn ngày:</span>
            <span className="font-bold text-foreground">{dayStats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Chờ cắm/giao:</span>
            <span className="font-bold">{dayStats.pending}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Đã giao:</span>
            <span className="font-bold">{dayStats.delivered}</span>
          </div>
          {dayStats.totalDue > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Cần thu hộ:</span>
              <span className="font-bold">{formatCurrency(dayStats.totalDue)}</span>
            </div>
          )}
        </div>

        {/* Lọc trạng thái trong ngày */}
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
            Tất cả ({dayStats.total})
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
            Chờ xử lý ({dayStats.pending})
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
            Đã xong ({dayStats.delivered})
          </button>
        </div>
      </div>

      {/* ⏰ Danh sách khung giờ tiến độ (Timeline Slots) */}
      {dayOrders.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-muted rounded-full">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-base font-semibold">Không có đơn giao trong ngày này</div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Chưa có đơn hàng nào được lên lịch hẹn giao vào ngày{' '}
              {currentDate.format('DD/MM/YYYY')}. Bạn có thể chọn ngày khác hoặc tạo đơn hàng mới.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {TIME_SLOTS.map((slot) => {
            const slotOrders = ordersBySlot.get(slot.id) || [];
            if (slotOrders.length === 0) return null; // Ẩn các khung giờ trống để giao diện tinh gọn

            const Icon = slot.icon;

            return (
              <div key={slot.id} className="space-y-3">
                {/* Tiêu đề Khung giờ */}
                <div className="flex items-center gap-2.5 pb-1 border-b border-border/60">
                  <div className={cn('p-1.5 rounded-lg border', slot.colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-sm text-foreground">{slot.title}</h3>
                    <span className="text-xs text-muted-foreground">({slot.timeRange})</span>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {slotOrders.length} đơn
                  </Badge>
                </div>

                {/* Danh sách Card đơn hoa trong khung giờ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slotOrders.map((order) => {
                    const isDelivered = order.status === ORDER_STATUS.DELIVERED;
                    const isCancelled =
                      order.status === ORDER_STATUS.CANCELLED ||
                      order.status === ORDER_STATUS.RETURNED;

                    return (
                      <Card
                        key={order.id}
                        className={cn(
                          'transition-all hover:shadow-md border-l-4 overflow-hidden relative',
                          isDelivered
                            ? 'border-l-emerald-500 bg-card/60'
                            : isCancelled
                              ? 'border-l-destructive/50 opacity-60 bg-muted/20'
                              : 'border-l-amber-500 bg-card',
                        )}
                      >
                        <CardContent className="p-4 space-y-3">
                          {/* Top: Giờ giao & Mã đơn & Trạng thái */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/40">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {order.deliveryTime || 'Chưa có giờ'}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                #{order.orderNumber}
                              </span>
                            </div>

                            {/* Badge trạng thái có thể bấm đổi nhanh */}
                            <EditableStatusBadge id={order.id} status={order.status} />
                          </div>

                          {/* Thông tin hoa & Tone màu */}
                          <div className="space-y-1">
                            <div className="font-semibold text-sm text-foreground flex items-center justify-between">
                              <span className="truncate">{order.type}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge
                                variant="outline"
                                className="text-[11px] font-normal bg-accent/30 text-accent-foreground border-accent flex items-center gap-1"
                              >
                                <Palette className="h-3 w-3" />
                                Tone: {order.tone}
                              </Badge>
                            </div>
                          </div>

                          {/* Khách hàng & Giao nhận */}
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">
                                👤 {order.client?.name || 'Khách vãng lai'}
                              </span>
                              {order.client?.phoneNumber && (
                                <a
                                  href={`tel:${order.client.phoneNumber}`}
                                  className="text-primary hover:underline flex items-center gap-1"
                                  title="Gọi điện cho khách"
                                >
                                  <Phone className="h-3 w-3" />
                                  {order.client.phoneNumber}
                                </a>
                              )}
                            </div>

                            <div className="flex items-start gap-1 text-[11px] line-clamp-2">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />
                              <span>{order.address}</span>
                            </div>
                          </div>

                          {/* Ghi chú cắm hoa / Dặn dò */}
                          {order.note && (
                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
                              <FileText className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                              <span className="italic font-medium">{order.note}</span>
                            </div>
                          )}

                          {/* Tài chính & Công nợ */}
                          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                            <div>
                              <span className="text-muted-foreground">Tổng: </span>
                              <span className="font-bold text-foreground">
                                {formatCurrency(Number(order.price) + Number(order.ship))}
                              </span>
                            </div>
                            <div>
                              {order.dueAmount > 0 ? (
                                <span className="font-semibold text-rose-600 dark:text-rose-400">
                                  Thu thêm: {formatCurrency(order.dueAmount)}
                                </span>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  Đã thanh toán đủ
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions Footer */}
                          <div className="pt-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs cursor-pointer"
                                onClick={() => onOpenReceipt(order)}
                                title="In hoá đơn"
                              >
                                <Printer className="h-3.5 w-3.5 mr-1 text-primary" />
                                In phiếu
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs cursor-pointer"
                                onClick={() => onEditOrder(order)}
                                title="Chỉnh sửa đơn"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            {/* Nút bấm nhanh đổi sang Đã giao */}
                            {order.status === ORDER_STATUS.PENDING && (
                              <Button
                                size="sm"
                                className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                onClick={() => handleMarkDelivered(order.id)}
                              >
                                <Truck className="h-3.5 w-3.5 mr-1" />
                                Đã giao
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
