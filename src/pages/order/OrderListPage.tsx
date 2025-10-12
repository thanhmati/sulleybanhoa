import { DataTable } from '@/components/ui/DataTable';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Button } from '@/components/ui/button';
import { useOrdersQuery } from '@/hooks/userOrdersQuery';
import { orderColumns } from './components/columns';
import { PlusCircleIcon } from 'lucide-react';

export default function OrderListPage() {
  const { data, isLoading } = useOrdersQuery();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        isLoading={isLoading}
        columns={orderColumns}
        data={data || []}
        toolbar={() => (
          <DataTableToolbar
            actions={
              <Button>
                <PlusCircleIcon /> Tạo đơn hàng
              </Button>
            }
          />
        )}
      />
    </div>
  );
}
