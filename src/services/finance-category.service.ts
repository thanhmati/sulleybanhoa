import { supabase } from '@/lib/supabase';
import { IFinanceCategory } from '@/types/finance-transaction';

export function mapFinanceCategoryFromDb(dbCat: any): IFinanceCategory {
  return {
    id: dbCat.id,
    name: dbCat.name,
    type: dbCat.type,
    createdAt: new Date(dbCat.created_at),
    updatedAt: new Date(dbCat.updated_at),
  };
}

export const financeCategoryService = {
  getAll: async (): Promise<IFinanceCategory[]> => {
    const { data, error } = await supabase
      .from('finance_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapFinanceCategoryFromDb);
  },
};
