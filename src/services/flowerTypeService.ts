import { supabase } from '@/lib/supabase';
import type { IFlowerType, ICreateFlowerTypePayload } from '@/types/catalog-metadata';

export function mapFlowerTypeFromDb(row: any): IFlowerType {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const flowerTypeService = {
  async getFlowerTypes(): Promise<IFlowerType[]> {
    const { data, error } = await supabase.from('flower_types').select('*');

    if (error) {
      console.error('Supabase flower_types error:', error);
      throw new Error(`Không thể tải danh sách loại hoa: ${error.message}`);
    }

    return (data || []).map(mapFlowerTypeFromDb);
  },

  async createFlowerType(payload: ICreateFlowerTypePayload): Promise<IFlowerType> {
    const { data, error } = await supabase
      .from('flower_types')
      .insert({
        name: payload.name,
        description: payload.description || '',
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể tạo loại hoa: ${error.message}`);
    }

    return mapFlowerTypeFromDb(data);
  },

  async updateFlowerType(
    id: string,
    payload: Partial<ICreateFlowerTypePayload>,
  ): Promise<IFlowerType> {
    const dbPayload: any = {};
    if (payload.name !== undefined) dbPayload.name = payload.name;
    if (payload.description !== undefined) dbPayload.description = payload.description;

    const { data, error } = await supabase
      .from('flower_types')
      .update(dbPayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể cập nhật loại hoa: ${error.message}`);
    }

    return mapFlowerTypeFromDb(data);
  },

  async deleteFlowerType(id: string): Promise<boolean> {
    const { error } = await supabase.from('flower_types').delete().eq('id', id);

    if (error) {
      throw new Error(`Không thể xóa loại hoa: ${error.message}`);
    }

    return true;
  },
};
