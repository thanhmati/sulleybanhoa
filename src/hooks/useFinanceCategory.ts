import { financeCategoryService } from '@/services/finance-category.service';
import { IFinanceCategory } from '@/types/finance-transaction';
import { useQuery } from '@tanstack/react-query';

const FINANCE_CATEGORY_QUERY_KEY = ['finance_categories'];

export function useFinanceCategoriesQuery() {
  return useQuery<IFinanceCategory[]>({
    queryKey: FINANCE_CATEGORY_QUERY_KEY,
    queryFn: financeCategoryService.getAll,
  });
}
