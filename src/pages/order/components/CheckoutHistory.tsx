import { DataTable } from '@/components/ui/DataTable';
import { TRANSACTION_TYPE, TRANSACTION_TYPE_LABEL } from '@/lib/constants/order.constant';
import { formatCurrency } from '@/lib/utils/formatters';
import { Order, Transaction } from '@/types/order';
import { ColumnDef } from '@tanstack/react-table';

interface Props {
  order?: Order | null;
}

export const columns = (): ColumnDef<Transaction>[] => [
  {
    accessorKey: 'amount',
    header: 'Giá tiền',
    cell: ({ getValue }) => <span>{formatCurrency(getValue<number>())}</span>,
  },

  {
    accessorKey: 'type',
    header: 'Loại',
    cell: ({ getValue }) => <span>{TRANSACTION_TYPE_LABEL[getValue<TRANSACTION_TYPE>()]}</span>,
  },
];

export default function CheckoutHistory({ order }: Props) {
  return <DataTable columns={columns()} data={order?.transaction || []} enablePagination={false} />;
}
