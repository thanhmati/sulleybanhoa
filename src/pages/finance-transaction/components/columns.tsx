import type { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { IFinanceTransaction } from '@/types/finance-transaction';
import {
  FINANCE_CATEGORY,
  FINANCE_CATEGORY_LABEL,
} from '@/lib/constants/finance-transaction.constant';
import { TransactionActionsCell } from './TransactionActionsCell';

export const financeTransactionColumns = (
  onEdit: (transaction: IFinanceTransaction) => void,
  onDelete: (id: string) => void,
): ColumnDef<IFinanceTransaction>[] => [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row: { index } }) => <span>{index + 1}</span>,
  },
  {
    accessorKey: 'category.name',
    header: 'Loại giao dịch',
    cell: ({ getValue }) => (
      <span className="font-medium text-foreground">
        {FINANCE_CATEGORY_LABEL[getValue<FINANCE_CATEGORY>()]}
      </span>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Số tiền',
    cell: ({ getValue }) => <span>{formatCurrency(getValue<number>())}</span>,
  },
  {
    accessorKey: 'note',
    header: 'Ghi chú',
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ getValue }) => <span>{formatDate(getValue<Date>(), 'DD/MM/YYYY')}</span>,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    cell: ({
      cell: {
        row: { original: data, index },
      },
    }) => {
      return (
        <TransactionActionsCell data={data} onEdit={onEdit} onDelete={onDelete} index={index} />
      );
    },
  },
];
