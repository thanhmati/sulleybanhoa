import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { TRANSACTION_TYPE_LABEL } from '@/lib/constants/order.constant';
import { useDeleteOrderTransaction } from '@/hooks/useOrders';
import { ITransaction } from '@/types/order';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentInfoProps {
  transactions: ITransaction[];
}

export default function PaymentInfo({ transactions }: PaymentInfoProps) {
  const [selectedTxToDelete, setSelectedTxToDelete] = useState<ITransaction | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const deleteOrderTransaction = useDeleteOrderTransaction();

  const handleOpenConfirm = (tx: ITransaction) => {
    setSelectedTxToDelete(tx);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTxToDelete?.id) return;

    deleteOrderTransaction.mutate(selectedTxToDelete.id, {
      onSuccess: () => {
        toast.success('Xoá thanh toán thành công!');
        setIsConfirmOpen(false);
        setSelectedTxToDelete(null);
      },
      onError: () => {
        toast.error('Xoá thanh toán thất bại');
      },
    });
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loại giao dịch</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Thời gian thanh toán</TableHead>
            <TableHead className="w-20 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions?.map((tx, index) => (
            <TableRow key={tx.id || index}>
              <TableCell className="capitalize">{TRANSACTION_TYPE_LABEL[tx.type]}</TableCell>
              <TableCell>{tx.amount.toLocaleString()} đ</TableCell>
              <TableCell>{dayjs(tx.paymentDate).format('DD/MM/YYYY HH:mm')}</TableCell>
              <TableCell className="text-right">
                {tx.id && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenConfirm(tx)}
                    disabled={deleteOrderTransaction.isPending}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    title="Xoá thanh toán"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Xác nhận xoá thanh toán"
        description={
          selectedTxToDelete ? (
            <span>
              Bạn có chắc chắn muốn xoá khoản thanh toán{' '}
              <strong className="text-foreground">
                {selectedTxToDelete.amount.toLocaleString()} đ
              </strong>{' '}
              ({TRANSACTION_TYPE_LABEL[selectedTxToDelete.type]}) không? Thao tác này không thể hoàn
              tác.
            </span>
          ) : (
            'Bạn có chắc chắn muốn xoá khoản thanh toán này không?'
          )
        }
        confirmText="Xoá thanh toán"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
