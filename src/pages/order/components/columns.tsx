import type { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { OrderActionsCell } from './OrderActionsCell';
import { EditableStatusBadge } from './EditableStatusBadge';

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
    cell: ({ cell: { row } }) => {
      const { status: currentStatus, id } = row.original;

      return <EditableStatusBadge status={currentStatus} id={id} />;
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
