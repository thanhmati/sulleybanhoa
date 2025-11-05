import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';

import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ORDER_STATUS, ORDER_STATUS_LABEL } from '@/lib/constants/order.constant';
import { OrderActionsCell } from './OrderActionsCell';

export const STATUS_COLORS: Record<ORDER_STATUS, string> = {
  [ORDER_STATUS.PENDING]: '#fbbf24', // vàng
  [ORDER_STATUS.DELIVERED]: '#22c55e', // xanh lá
  [ORDER_STATUS.CANCELLED]: '#ef4444', // đỏ
  [ORDER_STATUS.RETURNED]: '#3b82f6', // xanh dương
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
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: 'client.name',
    header: 'Tên khách hàng',
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
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
      return (
        <Badge style={{ backgroundColor: STATUS_COLORS[status], color: 'white' }}>
          {ORDER_STATUS_LABEL[status]}
        </Badge>
      );
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
