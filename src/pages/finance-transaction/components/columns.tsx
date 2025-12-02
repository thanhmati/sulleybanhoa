import type { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { IFinanceTransaction } from '@/types/finance-transaction';
import {
  FINANCE_CATEGORY,
  FINANCE_CATEGORY_LABEL,
} from '@/lib/constants/finance-transaction.constant';

export const financeTransactionColumns = (): ColumnDef<IFinanceTransaction>[] => [
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
];
