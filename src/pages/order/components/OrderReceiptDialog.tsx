import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OrderReceipt } from './OrderReceipt';
import { Order } from '@/types/order';
import { Printer } from 'lucide-react';

interface OrderReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
}

export function OrderReceiptDialog({ open, onOpenChange, order }: OrderReceiptDialogProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Xem trước hoá đơn (75mm x 125mm)
          </DialogTitle>
        </DialogHeader>

        <div className="my-2 max-h-[65vh] overflow-y-auto p-4 bg-muted/30 rounded-lg border border-border flex justify-center print:p-0 print:m-0 print:border-none print:bg-transparent print:max-h-none print:overflow-visible">
          <OrderReceipt order={order} />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            In hoá đơn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
