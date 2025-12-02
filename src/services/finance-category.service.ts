import api from '@/lib/axios';
import { IFinanceCategory } from '@/types/finance-transaction';

export const financeCategoryService = {
  getAll: async (): Promise<IFinanceCategory[]> => {
    const res = await api.get('/finance-category');
    return res.data;
  },
};
