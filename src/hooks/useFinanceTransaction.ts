import { financeTransactionService } from '@/services/finance-transaction.service';
import { IFinanceTransaction } from '@/types/finance-transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const FINANCE_TRANSACTION_QUERY_KEY = ['finance_transactions'];

export function useFinanceTransactionsQuery() {
  return useQuery<IFinanceTransaction[]>({
    queryKey: FINANCE_TRANSACTION_QUERY_KEY,
    queryFn: financeTransactionService.getAll,
  });
}

export function useCreateFinanceTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeTransactionService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FINANCE_TRANSACTION_QUERY_KEY }),
  });
}
