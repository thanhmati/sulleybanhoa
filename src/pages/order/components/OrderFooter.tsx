import { Button } from '@/components/ui/button';
import TransactionDialog from './TransactionDialog';
import { useState } from 'react';
import { Order } from '@/types/order';
import { Printer } from 'lucide-react';
import { OrderReceiptDialog } from './OrderReceiptDialog';

interface OrderFooterProps {
  isLoading: boolean;
  order?: Order;
}

export default function OrderFooter({ isLoading, order }: OrderFooterProps) {
  const [open, setOpen] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);

  return (
    <div className="flex flex-wrap gap-4">
      <Button type="submit" disabled={isLoading} size={'lg'}>
        {isLoading ? 'Đang lưu...' : 'Lưu'}
      </Button>

      <Button type="button" size={'lg'} variant={'secondary'} onClick={() => setOpen(true)}>
        Thanh toán
      </Button>

      {order && (
        <Button type="button" size={'lg'} variant={'outline'} onClick={() => setOpenReceipt(true)}>
          <Printer className="mr-2 h-5 w-5" />
          In hoá đơn
        </Button>
      )}

      <TransactionDialog open={open} onOpenChange={setOpen} />
      {order && (
        <OrderReceiptDialog open={openReceipt} onOpenChange={setOpenReceipt} order={order} />
      )}
    </div>
  );
}
