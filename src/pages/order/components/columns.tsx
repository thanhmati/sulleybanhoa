import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Order } from '@/types/order';

import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ORDER_STATUS } from '@/lib/constants/order.constant';

export const STATUS_COLORS: Record<
  ORDER_STATUS,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [ORDER_STATUS.PENDING]: 'secondary',
  [ORDER_STATUS.DELIVERED]: 'default',
  [ORDER_STATUS.CANCELLED]: 'destructive',
  [ORDER_STATUS.RETURNED]: 'outline',
};

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Mã đơn',
    cell: ({ getValue }) => (
      <span className="font-medium text-foreground">{getValue<string>() ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'deliveryTime',
    header: 'Thời gian giao',
    cell: ({ getValue }) => <span>{formatDate(getValue<Date>())}</span>,
  },
  {
    accessorKey: 'zalo',
    header: 'Zalo',
    cell: ({ getValue }) => getValue<string>() || '-',
  },
  {
    accessorKey: 'instagram',
    header: 'Instagram',
    cell: ({ getValue }) => getValue<string>() || '-',
  },
  {
    accessorKey: 'facebook',
    header: 'Facebook',
    cell: ({ getValue }) => getValue<string>() || '-',
  },
  {
    accessorKey: 'type',
    header: 'Loại',
    cell: ({ getValue }) => getValue<string>() || '-',
  },
  {
    accessorKey: 'tone',
    header: 'Tone',
    cell: ({ getValue }) => getValue<string>() || '-',
  },
  {
    accessorKey: 'price',
    header: 'Giá tiền',
    cell: ({ getValue }) => <span>{formatCurrency(getValue<number>())}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ getValue }) => {
      const status = getValue<ORDER_STATUS>() ?? 'UNKNOWN';
      const variant = STATUS_COLORS[status] ?? 'outline';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ cell }) => {
      const order = cell.row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log('Edit', order)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Delete', order)}>Xoá</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
