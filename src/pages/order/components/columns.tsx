import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';

import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ORDER_STATUS, ORDER_STATUS_LABEL } from '@/lib/constants/order.constant';
import { OrderActionsCell } from './OrderActionsCell';

export const STATUS_COLORS: Record<
  ORDER_STATUS,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [ORDER_STATUS.PENDING]: 'secondary',
  [ORDER_STATUS.DELIVERED]: 'default',
  [ORDER_STATUS.CANCELLED]: 'destructive',
  [ORDER_STATUS.RETURNED]: 'outline',
};

export const orderColumns = (
  onEdit: (order: Order) => void,
  onDelete: (id: string) => void,
): ColumnDef<Order>[] => [
  {
    accessorKey: 'orderNumber',
    header: 'Mã đơn',
    cell: ({ getValue }) => (
      <span className="font-medium text-foreground">{getValue<string>() ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'deliveryDate',
    header: 'Ngày giao',
    cell: ({ getValue }) => <span>{formatDate(getValue<Date>(), 'DD/MM/YYYY')}</span>,
  },
  {
    accessorKey: 'deliveryTime',
    header: 'Giờ giao',
    cell: ({ getValue }) => <span>{formatDate(getValue<Date>(), 'hh:mm A')}</span>,
  },
  {
    accessorKey: 'price',
    header: 'Giá tiền',
    cell: ({ getValue }) => <span>{formatCurrency(getValue<number>())}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    enableSorting: false,
    cell: ({ getValue }) => {
      const status = getValue<ORDER_STATUS>() ?? ORDER_STATUS.PENDING;
      const variant = STATUS_COLORS[status] ?? 'outline';
      return <Badge variant={variant}>{ORDER_STATUS_LABEL[status]}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ getValue }) => <span>{formatDate(getValue<Date>())}</span>,
    enableHiding: true,
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    cell: ({
      cell: {
        row: { original: order },
      },
    }) => {
      return <OrderActionsCell order={order} onEdit={onEdit} onDelete={onDelete} />;
    },
  },
];
