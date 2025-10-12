import { DataTable } from '@/components/ui/DataTable';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Button } from '@/components/ui/button';
import { useOrdersQuery } from '@/hooks/useOrders';
import { orderColumns } from './components/columns';
import { PlusCircleIcon } from 'lucide-react';
import { OrderFormDialog } from './components/OrderFormDialog';
import { useState } from 'react';

export default function OrderListPage() {
  const { data, isLoading } = useOrdersQuery();
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        isLoading={isLoading}
        columns={orderColumns}
        data={data || []}
        toolbar={() => (
          <DataTableToolbar
            actions={
              <>
                <Button onClick={() => setOpen(true)}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Tạo đơn hàng
                </Button>
                <OrderFormDialog open={open} onOpenChange={setOpen} />
              </>
            }
          />
        )}
      />
    </div>
  );
}
