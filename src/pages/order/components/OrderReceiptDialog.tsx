import { useMemo, useRef, useState } from 'react';
import { toBlob, toPng } from 'html-to-image';
import { toast } from 'sonner';
import { Copy, Download, Printer, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OrderReceipt } from './OrderReceipt';
import { useStoreSettingsQuery } from '@/hooks/useStoreSettings';
import { useOrdersQuery } from '@/hooks/useOrders';
import { formatOrderPaymentCode } from '@/lib/utils/vietqr';
import type { Order } from '@/types/order';

interface OrderReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
}

interface OrderReceiptDialogInnerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

function OrderReceiptDialogInner({ open, onOpenChange, order }: OrderReceiptDialogInnerProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

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
      toast.error('Trình duyệt không hỗ trợ copy ảnh trực tiếp, vui lòng dùng nút Tải ảnh');
      return;
    }

    setIsCopying(true);
    try {
      const node = captureRef.current;
      const blob = await toBlob(node, {
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: { margin: '0' },
      });

      if (!blob) {
        throw new Error('Không tạo được ảnh hoá đơn');
      }

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setJustCopied(true);
      toast.success('Đã copy ảnh hoá đơn! Bạn có thể dán thẳng vào Zalo/Messenger.');
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      toast.error('Không thể copy vào Clipboard. Vui lòng dùng nút Tải ảnh để gửi khách.');
    } finally {
      setIsCopying(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!captureRef.current) return;

    setIsDownloading(true);
    try {
      const node = captureRef.current;
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: { margin: '0' },
      });

      const link = document.createElement('a');
      link.download = `hoa-don-${paymentCode}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`Đã tải xuống hoa-don-${paymentCode}.png`);
    } catch {
      toast.error('Tải ảnh hoá đơn thất bại, vui lòng thử lại.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Xem trước hoá đơn ({paymentCode})
          </DialogTitle>
        </DialogHeader>

        <div className="my-1 max-h-[68vh] overflow-y-auto p-4 bg-muted/30 rounded-lg border border-border flex justify-center print:p-0 print:m-0 print:border-none print:bg-transparent print:max-h-none print:overflow-visible">
          <OrderReceipt
            order={liveOrder}
            invoiceConfig={invoiceConfig}
            captureRef={captureRef}
            enablePrintPortal={open}
          />
        </div>

        <DialogFooter className="flex-wrap gap-2 sm:justify-between">
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
              disabled={isCopying || isDownloading}
              className="gap-1.5 cursor-pointer"
            >
              {justCopied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {isCopying ? 'Đang copy...' : justCopied ? 'Đã copy' : 'Copy ảnh'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadImage}
              disabled={isCopying || isDownloading}
              className="gap-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Đang tải...' : 'Tải ảnh'}
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

export function OrderReceiptDialog({ open, onOpenChange, order }: OrderReceiptDialogProps) {
  if (!open || !order) return null;

  return <OrderReceiptDialogInner open={open} onOpenChange={onOpenChange} order={order} />;
}
