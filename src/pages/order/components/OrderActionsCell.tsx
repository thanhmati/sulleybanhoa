import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Printer, Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Order } from '@/types/order';
import { OrderReceiptDialog } from './OrderReceiptDialog';

interface OrderActionsCellProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

export function OrderActionsCell({ order, onEdit, onDelete }: OrderActionsCellProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
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
          <DropdownMenuItem onClick={() => setOpenReceipt(true)}>
            <Printer className="mr-2 h-4 w-4 text-primary" />
            In hoá đơn
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit?.(order)}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              setOpenConfirm(true);
              setSelectedOrder(order);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xoá
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderReceiptDialog open={openReceipt} onOpenChange={setOpenReceipt} order={order} />

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
