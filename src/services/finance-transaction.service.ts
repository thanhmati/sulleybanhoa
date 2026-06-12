import { supabase } from '@/lib/supabase';
import {
  ICreateFinanceTransaction,
  IFinanceTransaction,
  IUpdateFinanceTransaction,
} from '@/types/finance-transaction';
import { mapFinanceCategoryFromDb } from './finance-category.service';

export function mapFinanceTransactionFromDb(dbTx: any): IFinanceTransaction {
  return {
    id: dbTx.id,
    amount: Number(dbTx.amount),
    note: dbTx.note || undefined,
    categoryId: dbTx.category_id,
    category: dbTx.category ? mapFinanceCategoryFromDb(dbTx.category) : (undefined as any),
    date: dbTx.date,
    createdAt: new Date(dbTx.created_at),
    updatedAt: new Date(dbTx.updated_at),
  };
}

export const financeTransactionService = {
  getAll: async (): Promise<IFinanceTransaction[]> => {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*, category:finance_categories(*)')
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapFinanceTransactionFromDb);
  },

  create: async (data: ICreateFinanceTransaction): Promise<string> => {
    const { error } = await supabase.from('finance_transactions').insert({
      amount: data.amount,
      note: data.note,
      category_id: data.categoryId,
      date: data.date,
    });

    if (error) throw error;
    return 'Finance transaction created successfully';
  },

  update: async (id: string, data: IUpdateFinanceTransaction): Promise<string> => {
    const { error } = await supabase
      .from('finance_transactions')
      .update({
        amount: data.amount,
        note: data.note,
        category_id: data.categoryId,
        date: data.date,
      })
      .eq('id', id);

    if (error) throw error;
    return 'Finance transaction updated successfully';
  },

  delete: async (id: string): Promise<string> => {
    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);

    if (error) throw error;
    return 'Finance transaction deleted successfully';
  },
};
