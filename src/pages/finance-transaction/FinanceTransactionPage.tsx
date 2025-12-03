import { DataTable } from '@/components/ui/DataTable';
import {
  useDeleteFinanceTransaction,
  useFinanceTransactionsQuery,
} from '@/hooks/useFinanceTransaction';
import { financeTransactionColumns } from './components/columns';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { FinanceTransactionFormDialog } from './components/FinanceTransactionFormDialog';
import { useState } from 'react';
import { IFinanceTransaction } from '@/types/finance-transaction';
import { toast } from 'sonner';

export default function FinanceTransactionListPage() {
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<IFinanceTransaction>();

  const { data, isLoading } = useFinanceTransactionsQuery();
  const deleteTransaction = useDeleteFinanceTransaction();

  const handleEdit = (data: IFinanceTransaction) => {
    setOpen(true);
    setSelectedTransaction(data);
  };

  const handleDelete = (id: string) => {
    deleteTransaction.mutate(id, {
      onSuccess: () => {
        toast.success('Xoá giao dịch thành công!');
      },
      onError: () => toast.error('Không thể xoá giao dịch này'),
    });
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSelectedTransaction(undefined);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <DataTable
        isLoading={isLoading}
        columns={financeTransactionColumns(handleEdit, handleDelete)}
        data={data || []}
        toolbar={() => (
          <DataTableToolbar
            actions={
              <>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Tạo giao dịch
                </Button>
              </>
            }
          />
        )}
      />

      <FinanceTransactionFormDialog
        open={open}
        onOpenChange={handleOpenChange}
        data={selectedTransaction}
      />
    </div>
  );
}
