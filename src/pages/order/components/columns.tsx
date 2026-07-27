import type { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { OrderActionsCell } from './OrderActionsCell';
import { EditableStatusBadge } from './EditableStatusBadge';
import { PaidIcon } from './PaidIcon';
import dayjs from 'dayjs';

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
    footer: () => <span className="font-bold text-foreground">Tổng cộng</span>,
    cell: ({ getValue }) => <span>{formatDate(getValue<Date>(), 'DD/MM/YYYY')}</span>,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const rowDate = row.getValue<Date | string>(columnId);
      if (!rowDate) return false;
      const rowDateStr = dayjs(rowDate).format('YYYY-MM-DD');
      const filterDateStr = dayjs(filterValue).format('YYYY-MM-DD');
      return rowDateStr === filterDateStr;
    },
  },
  {
    accessorKey: 'deliveryTime',
    header: 'Giờ giao',
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: 'client.name',
    id: 'clientName',
    header: 'Tên khách hàng',
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: 'type',
    header: 'Loại',
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: 'price',
    header: 'Giá tiền',
    cell: ({ getValue }) => <span>{formatCurrency(getValue<number>())}</span>,
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;
      const total = rows.reduce((sum, row) => sum + (Number(row.original.price) || 0), 0);
      return <span className="font-bold text-foreground">{formatCurrency(total)}</span>;
    },
  },
  {
    accessorKey: 'dueAmount',
    header: 'Số tiền còn nợ',
    cell: ({ getValue }) => {
      return <span>{formatCurrency(getValue<number>())}</span>;
    },
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;
      const total = rows.reduce((sum, row) => sum + (Number(row.original.dueAmount) || 0), 0);
      return (
        <span
          className={
            total > 0
              ? 'font-bold text-amber-600 dark:text-amber-400'
              : 'font-bold text-emerald-600 dark:text-emerald-400'
          }
        >
          {formatCurrency(total)}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    enableSorting: false,
    cell: ({ cell: { row } }) => {
      const { status: currentStatus, id } = row.original;

      return <EditableStatusBadge status={currentStatus} id={id} />;
    },
    filterFn: (row, _, filterValue) => {
      return row.original.status === filterValue;
    },
  },
  {
    accessorKey: 'isPaid',
    header: 'Thanh toán',
    enableSorting: false,
    cell: ({ getValue }) => <PaidIcon isPaid={getValue<boolean>()} />,
    filterFn: (row, _, filterValue) => {
      return row.original.isPaid === JSON.parse(filterValue);
    },
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
