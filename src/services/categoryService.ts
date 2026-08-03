import { supabase } from '@/lib/supabase';
import type { ICategory, ICreateCategoryPayload } from '@/types/catalog-metadata';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function mapCategoryFromDb(row: any): ICategory {
  return {
    id: row.id,
    key: row.key || slugify(row.name),
    name: row.name,
    description: row.description || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const categoryService = {
  async getCategories(): Promise<ICategory[]> {
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
      console.error('Supabase categories error:', error);
      throw new Error(`Không thể tải danh sách danh mục: ${error.message}`);
    }

    return (data || []).map(mapCategoryFromDb);
  },

  async createCategory(payload: ICreateCategoryPayload): Promise<ICategory> {
    const generatedKey = payload.key ? payload.key.toLowerCase().trim() : slugify(payload.name);

    const { data, error } = await supabase
      .from('categories')
      .insert({
        key: generatedKey,
        name: payload.name,
        description: payload.description || '',
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể tạo danh mục: ${error.message}`);
    }

    return mapCategoryFromDb(data);
  },

  async updateCategory(id: string, payload: Partial<ICreateCategoryPayload>): Promise<ICategory> {
    const dbPayload: any = {};
    if (payload.name !== undefined) {
      dbPayload.name = payload.name;
      dbPayload.key = payload.key ? payload.key.toLowerCase().trim() : slugify(payload.name);
    }
    if (payload.description !== undefined) dbPayload.description = payload.description;

    const { data, error } = await supabase
      .from('categories')
      .update(dbPayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể cập nhật danh mục: ${error.message}`);
    }

    return mapCategoryFromDb(data);
  },

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      throw new Error(`Không thể xóa danh mục: ${error.message}`);
    }

    return true;
  },
};
