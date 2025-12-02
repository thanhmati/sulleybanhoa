import api from '@/lib/axios';
import { ICreateFinanceTransaction, IFinanceTransaction } from '@/types/finance-transaction';

export const financeTransactionService = {
  getAll: async (): Promise<IFinanceTransaction[]> => {
    const res = await api.get('/finance-transaction');
    return res.data;
  },

  create: async (data: ICreateFinanceTransaction): Promise<string> => {
    const res = await api.post('/finance-transaction', data);
    return res.data;
  },
};
