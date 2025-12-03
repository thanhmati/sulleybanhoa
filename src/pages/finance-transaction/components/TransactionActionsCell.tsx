import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IFinanceTransaction } from '@/types/finance-transaction';

interface TransactionActionsCellProps {
  data: IFinanceTransaction;
  onEdit: (data: IFinanceTransaction) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function TransactionActionsCell({
  data,
  onEdit,
  onDelete,
  index,
}: TransactionActionsCellProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<IFinanceTransaction>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit?.(data)}>Chỉnh sửa</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenConfirm(true);
              setSelectedTransaction(data);
            }}
          >
            Xoá
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Xác nhận xoá"
        description={
          <>
            Bạn có chắc muốn xoá giao dịch số {index + 1} không ?
            <br />
            Hành động này <b>không thể hoàn tác</b>.
          </>
        }
        confirmText="Xoá"
        variant="destructive"
        onConfirm={() => {
          if (selectedTransaction?.id) {
            onDelete(selectedTransaction.id);
          }
        }}
      />
    </>
  );
}
