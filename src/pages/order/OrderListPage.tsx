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

export default function OrderListPage() {
  const { data, isLoading } = useOrdersQuery();
  const deleteOrder = useDeleteOrder();

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleCreate = () => {
    setSelectedOrder(null);
    setOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleDelete = (orderId: string) => {
    deleteOrder.mutate(orderId, {
      onSuccess: () => {
        toast.success('Xoá đơn hàng thành công!');
      },
      onError: () => toast.error('Xoá thất bại'),
    });
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        isLoading={isLoading}
        columns={orderColumns(handleEdit, handleDelete)}
        data={data || []}
        toolbar={() => (
          <DataTableToolbar
            actions={
              <>
                <Button onClick={handleCreate}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Tạo đơn hàng
                </Button>
              </>
            }
          />
        )}
      />
      <OrderFormDialog open={open} onOpenChange={setOpen} initialData={selectedOrder} />
    </div>
  );
}
