import { DataTable } from '@/components/ui/DataTable';
import { useFinanceTransactionsQuery } from '@/hooks/useFinanceTransaction';
import { financeTransactionColumns } from './components/columns';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { FinanceTransactionFormDialog } from './components/FinanceTransactionFormDialog';
import { useState } from 'react';

export default function FinanceTransactionListPage() {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useFinanceTransactionsQuery();

  return (
    <div className="container mx-auto p-6">
      <DataTable
        isLoading={isLoading}
        columns={financeTransactionColumns()}
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

      <FinanceTransactionFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
