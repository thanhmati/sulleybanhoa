import api from '@/lib/axios';
import {
  ICreateFinanceTransaction,
  IFinanceTransaction,
  IUpdateFinanceTransaction,
} from '@/types/finance-transaction';

export const financeTransactionService = {
  getAll: async (): Promise<IFinanceTransaction[]> => {
    const res = await api.get('/finance-transaction');
    return res.data;
  },

  create: async (data: ICreateFinanceTransaction): Promise<string> => {
    const res = await api.post('/finance-transaction', data);
    return res.data;
  },

  update: async (id: string, data: IUpdateFinanceTransaction): Promise<string> => {
    const res = await api.put(`/finance-transaction/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<string> => {
    const res = await api.delete(`/finance-transaction/${id}`);
    return res.data;
  },
};
