import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Flower2, Copy, Printer, Calendar, Layers, Clock, Check, Package } from 'lucide-react';
import { Order } from '@/types/order';
import { IFlowerType } from '@/types/catalog-metadata';
import { calculateFlowerImportPlan, generateFlowerImportText } from '@/lib/utils/flowerImport';
import { toast } from 'sonner';

interface FlowerImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: Order[];
  flowerTypes: IFlowerType[];
  initialDate?: string;
}

export function FlowerImportDialog({
  open,
  onOpenChange,
  orders,
  flowerTypes,
  initialDate,
}: FlowerImportDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate ? dayjs(initialDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
  );
  const [copied, setCopied] = useState(false);

  // Cập nhật selectedDate mỗi khi popup mở ra hoặc initialDate thay đổi
  useEffect(() => {
    if (open) {
      setSelectedDate(
        initialDate ? dayjs(initialDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      );
    }
  }, [open, initialDate]);

  // Tính toán kế hoạch nhập hoa theo ngày đang chọn
  const plan = calculateFlowerImportPlan(orders, flowerTypes, selectedDate);

  const formattedDate = dayjs(selectedDate).format('DD/MM/YYYY');

  const handleCopy = async () => {
    const text = generateFlowerImportText(plan);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Đã sao chép danh sách hoa cần nhập vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Không thể sao chép vào bộ nhớ tạm');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2 font-serif text-foreground">
                <Flower2 className="text-primary h-5 w-5" />
                Danh Sách Hoa Cần Nhập
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Tự động tính ngày cần nhập dựa trên ngày giao đơn hàng và số ngày nhập trước của
                từng loại hoa.
              </p>
            </DialogHeader>

            {/* Chọn ngày xem kế hoạch nhập */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap font-medium flex items-center gap-1">
                <Calendar size={13} /> Ngày nhập:
              </span>
              <DatePicker
                value={dayjs(selectedDate).toDate()}
                onChange={(d) => {
                  if (d) {
                    setSelectedDate(dayjs(d).format('YYYY-MM-DD'));
                  }
                }}
              />
            </div>
          </div>

          {/* Cards tóm tắt số liệu */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Flower2 size={18} />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground font-medium">Số loại hoa</div>
                <div className="text-lg font-bold text-foreground">
                  {plan.totalFlowerTypes}{' '}
                  <span className="text-xs font-normal text-muted-foreground">loại</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
                <Layers size={18} />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground font-medium">
                  Tổng số bó cần dùng
                </div>
                <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {plan.totalBouquets}{' '}
                  <span className="text-xs font-normal text-muted-foreground">bó</span>
                </div>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background text-foreground shadow-2xs">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground font-medium">
                  Kế hoạch cho ngày
                </div>
                <div className="text-sm font-bold text-foreground">{formattedDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung danh sách hoa cần nhập */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {plan.items.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed bg-muted/20">
              <Package className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <h4 className="text-sm font-semibold text-foreground">
                Không có hoa nào cần nhập vào ngày {formattedDate}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Không tìm thấy đơn hàng nào có ngày giao tương ứng cần chuẩn bị hoặc nhập hoa vào
                ngày này.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground flex justify-between items-center px-1">
                <span>Chi tiết từng loại hoa và các đơn hàng sử dụng</span>
                <span>Sắp xếp theo số lượng bó cần dùng</span>
              </div>

              <div className="rounded-xl border border-border overflow-hidden bg-card divide-y divide-border">
                {plan.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">
                          {idx + 1}. {item.flowerName}
                        </span>
                        {item.leadDays > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <Clock size={11} /> Nhập trước {item.leadDays} ngày
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                            Nhập trong ngày
                          </span>
                        )}
                      </div>

                      {/* Danh sách đơn hàng sử dụng hoa này */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.orders.map((o) => (
                          <div
                            key={o.id}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-accent/60 border border-border/80 text-foreground"
                          >
                            <span className="font-semibold">#{o.orderNumber}</span>
                            <span className="text-muted-foreground">({o.clientName})</span>
                            <span className="text-[10px] text-primary-dark font-medium">
                              • Giao {dayjs(o.deliveryDate).format('DD/MM')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Số bó cần dùng */}
                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
                      <span className="text-[11px] text-muted-foreground sm:mb-0.5">Dùng cho:</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/15 text-primary-dark font-bold text-sm border border-primary/30">
                        {item.bouquetCount} bó
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <DialogFooter className="p-4 border-t border-border bg-card flex flex-row items-center justify-between sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={plan.items.length === 0}
              className="cursor-pointer gap-1.5"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? 'Đã chép' : 'Sao chép (gửi Zalo)'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={plan.items.length === 0}
              className="cursor-pointer gap-1.5 hidden sm:inline-flex"
            >
              <Printer size={14} />
              In danh sách
            </Button>
          </div>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
