import { useMemo, useRef, useState } from 'react';
import { toBlob } from 'html-to-image';
import { toast } from 'sonner';
import { Copy, Printer, Check, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { OrderReceipt, type ReceiptMode } from './OrderReceipt';
import { useStoreSettingsQuery } from '@/hooks/useStoreSettings';
import { useOrdersQuery } from '@/hooks/useOrders';
import { formatOrderPaymentCode } from '@/lib/utils/vietqr';
import { cn } from '@/lib/utils';
import type { Order } from '@/types/order';

interface OrderReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
  initialMode?: ReceiptMode;
}

interface OrderReceiptDialogInnerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  initialMode?: ReceiptMode;
}

function OrderReceiptDialogInner({
  open,
  onOpenChange,
  order,
  initialMode,
}: OrderReceiptDialogInnerProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  const [mode, setMode] = useState<ReceiptMode>(() => {
    if (initialMode) return initialMode;
    return Number(order.deposit || 0) <= 0 && !order.isPaid && Number(order.dueAmount || 0) > 0
      ? 'deposit'
      : 'sale';
  });
  const [customDepositAmount, setCustomDepositAmount] = useState<number | undefined>(undefined);

  const { data: settings } = useStoreSettingsQuery();
  const { data: cachedOrders } = useOrdersQuery();

  // Luôn ưu tiên dữ liệu đơn hàng mới nhất trong cache nếu vừa được cập nhật qua Realtime
  const liveOrder = useMemo(() => {
    const matched = cachedOrders?.find((item) => item.id === order.id);
    if (!matched) return order;
    const matchedUpdated = new Date(matched.updatedAt).getTime();
    const propUpdated = new Date(order.updatedAt).getTime();
    return matchedUpdated >= propUpdated ? matched : order;
  }, [order, cachedOrders]);

  const paymentCode = formatOrderPaymentCode(liveOrder.orderNumber, liveOrder.id) || 'don-hang';
  const invoiceConfig = settings?.store_invoice_bank;

  const liveDueAmount = Math.max(0, Number(liveOrder.dueAmount ?? 0));
  const liveDeposit = Math.max(0, Number(liveOrder.deposit ?? 0));
  const configuredDeposit = Math.max(
    0,
    Math.round(Number(invoiceConfig?.defaultDepositAmount ?? 200000)),
  );
  const autoDepositAmount =
    liveDueAmount <= 0 || liveOrder.isPaid
      ? 0
      : liveDeposit > 0
        ? 0
        : Math.min(configuredDeposit > 0 ? configuredDeposit : 200000, liveDueAmount);

  const displayedDepositInput =
    customDepositAmount !== undefined ? customDepositAmount : autoDepositAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyImage = async () => {
    if (!captureRef.current) return;

    if (
      typeof navigator === 'undefined' ||
      !navigator.clipboard?.write ||
      typeof ClipboardItem === 'undefined'
    ) {
      toast.error('Trình duyệt không hỗ trợ copy ảnh trực tiếp.');
      return;
    }

    setIsCopying(true);
    try {
      const node = captureRef.current;
      const exportWidth = Math.ceil(node.scrollWidth || node.offsetWidth);
      const exportHeight = Math.ceil(node.scrollHeight || node.offsetHeight);
      const blob = await toBlob(node, {
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: exportWidth,
        height: exportHeight,
        style: { margin: '0' },
      });

      if (!blob) {
        throw new Error('Không tạo được ảnh hoá đơn');
      }

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setJustCopied(true);
      toast.success('Đã copy ảnh hoá đơn!');
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      toast.error('Không thể copy vào Clipboard, vui lòng thử lại.');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[92dvh] flex flex-col">
        <DialogHeader className="shrink-0 space-y-2.5">
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            {mode === 'deposit'
              ? `Hoá đơn đặt cọc (${paymentCode})`
              : `Xem trước hoá đơn (${paymentCode})`}
          </DialogTitle>

          {/* Chuyển đổi nhanh Hoá đơn đặt cọc / Hoá đơn bán hàng */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 rounded-lg border bg-muted/60 p-1 text-xs">
              <button
                type="button"
                onClick={() => setMode('deposit')}
                className={cn(
                  'rounded-md px-3 py-1.5 font-medium transition-colors cursor-pointer',
                  mode === 'deposit'
                    ? 'bg-background text-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Hoá đơn đặt cọc
              </button>
              <button
                type="button"
                onClick={() => setMode('sale')}
                className={cn(
                  'rounded-md px-3 py-1.5 font-medium transition-colors cursor-pointer',
                  mode === 'sale'
                    ? 'bg-background text-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Hoá đơn bán hàng
              </button>
            </div>

            {mode === 'deposit' && liveDueAmount > 0 && !liveOrder.isPaid && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border bg-muted/30 text-xs">
                <span className="text-muted-foreground shrink-0">Số tiền cọc:</span>
                <div className="flex-1 min-w-0">
                  <CurrencyInput
                    value={displayedDepositInput}
                    onChange={(val) => setCustomDepositAmount(Math.max(0, Number(val || 0)))}
                  />
                </div>
                {customDepositAmount !== undefined && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCustomDepositAmount(undefined)}
                    title="Khôi phục mức cọc mặc định"
                    className="h-7 px-2 text-[11px] gap-1 shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Mặc định
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="my-1 flex-1 min-h-0 overflow-auto p-4 bg-muted/30 rounded-lg border border-border print:p-0 print:m-0 print:border-none print:bg-transparent print:max-h-none print:overflow-visible">
          <div className="flex justify-center items-start min-w-fit">
            <OrderReceipt
              order={liveOrder}
              invoiceConfig={invoiceConfig}
              captureRef={captureRef}
              enablePrintPortal={open}
              mode={mode}
              depositAmountOverride={customDepositAmount}
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 flex-wrap gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Đóng
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyImage}
              disabled={isCopying}
              className="gap-1.5 cursor-pointer"
            >
              {justCopied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {isCopying ? 'Đang copy...' : justCopied ? 'Đã copy' : 'Copy ảnh'}
            </Button>

            <Button type="button" onClick={handlePrint} className="gap-1.5 cursor-pointer">
              <Printer className="h-4 w-4" />
              In hoá đơn
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OrderReceiptDialog({
  open,
  onOpenChange,
  order,
  initialMode,
}: OrderReceiptDialogProps) {
  if (!open || !order) return null;

  return (
    <OrderReceiptDialogInner
      open={open}
      onOpenChange={onOpenChange}
      order={order}
      initialMode={initialMode}
    />
  );
}
