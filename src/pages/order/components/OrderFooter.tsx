import { Button } from '@/components/ui/button';
import TransactionDialog from './TransactionDialog';
import { useState } from 'react';

export default function OrderFooter({ isLoading }: { isLoading: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <Button type="submit" disabled={isLoading} size={'lg'}>
        {isLoading ? 'Đang lưu...' : 'Lưu'}
      </Button>

      <Button type="button" size={'lg'} variant={'secondary'} onClick={() => setOpen(true)}>
        Thanh toán
      </Button>

      <TransactionDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
