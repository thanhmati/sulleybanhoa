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
import { Order } from '@/types/order';

interface OrderActionsCellProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

export function OrderActionsCell({ order, onEdit, onDelete }: OrderActionsCellProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

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
          <DropdownMenuItem onClick={() => onEdit?.(order)}>Chỉnh sửa</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenConfirm(true);
              setSelectedOrder(order);
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
            Bạn có chắc muốn xoá đơn hàng <strong>{order.orderNumber}</strong> không?
            <br />
            Hành động này <b>không thể hoàn tác</b>.
          </>
        }
        confirmText="Xoá"
        variant="destructive"
        onConfirm={() => {
          if (selectedOrder?.id) {
            onDelete(selectedOrder.id);
          }
        }}
      />
    </>
  );
}
