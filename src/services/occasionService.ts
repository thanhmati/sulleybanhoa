import { supabase } from '@/lib/supabase';
import type { IOccasion, ICreateOccasionPayload } from '@/types/catalog-metadata';

export function mapOccasionFromDb(row: any): IOccasion {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const occasionService = {
  async getOccasions(): Promise<IOccasion[]> {
    const { data, error } = await supabase.from('occasions').select('*');

    if (error) {
      console.error('Supabase occasions error:', error);
      throw new Error(`Không thể tải danh sách dịp tặng: ${error.message}`);
    }

    return (data || []).map(mapOccasionFromDb);
  },

  async createOccasion(payload: ICreateOccasionPayload): Promise<IOccasion> {
    const { data, error } = await supabase
      .from('occasions')
      .insert({
        name: payload.name,
        description: payload.description || '',
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể tạo dịp tặng: ${error.message}`);
    }

    return mapOccasionFromDb(data);
  },

  async updateOccasion(id: string, payload: Partial<ICreateOccasionPayload>): Promise<IOccasion> {
    const dbPayload: any = {};
    if (payload.name !== undefined) dbPayload.name = payload.name;
    if (payload.description !== undefined) dbPayload.description = payload.description;

    const { data, error } = await supabase
      .from('occasions')
      .update(dbPayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể cập nhật dịp tặng: ${error.message}`);
    }

    return mapOccasionFromDb(data);
  },

  async deleteOccasion(id: string): Promise<boolean> {
    const { error } = await supabase.from('occasions').delete().eq('id', id);

    if (error) {
      throw new Error(`Không thể xóa dịp tặng: ${error.message}`);
    }

    return true;
  },
};
