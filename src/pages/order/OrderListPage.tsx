import { DataTable } from '@/components/ui/DataTable';
import { DataTableToolbar } from '@/components/ui/DataTableToolbar';
import { Button } from '@/components/ui/button';
import { useDeleteOrder, useOrdersQuery } from '@/hooks/useOrders';
import { orderColumns } from './components/columns';
import { PlusCircleIcon } from 'lucide-react';
import { OrderFormDialog } from './components/OrderFormDialog';
import { useState } from 'react';
import { Order } from '@/types/order';
import { toast } from 'sonner';
import { OrderFilters } from './components/OrderFilters';
import { useNavigate } from 'react-router-dom';

export default function OrderListPage() {
  const { data, isLoading } = useOrdersQuery();
  const deleteOrder = useDeleteOrder();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    setOpen(true);
  };

  const handleEdit = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleDelete = (orderId: string) => {
    deleteOrder.mutate(orderId, {
      onSuccess: () => {
        toast.success('Xoá đơn hàng thành công!');
      },
      onError: () => toast.error('Không thể xoá đơn hàng này'),
    });
  };

  return (
    <div className="container mx-auto p-6">
      <DataTable
        isLoading={isLoading}
        columns={orderColumns(handleEdit, handleDelete)}
        data={data || []}
        externalState={{
          sorting: [{ id: 'orderNumber', desc: true }],
          columnVisibility: { orderNumber: false },
        }}
        toolbar={(table) => (
          <DataTableToolbar
            actions={
              <>
                <Button onClick={handleCreate}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Tạo đơn hàng
                </Button>
              </>
            }
            filters={<OrderFilters table={table} />}
          />
        )}
      />
      <OrderFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
