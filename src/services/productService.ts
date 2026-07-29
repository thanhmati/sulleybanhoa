import { supabase } from '@/lib/supabase';
import type { Product, ICreateProductRequest, ProductFiltersParam } from '@/types/product';
import { MOCK_PRODUCTS } from '@/data/products';

export function mapProductFromDb(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    description: row.description || '',
    imageUrl: row.image_url,
    images: row.images || [row.image_url],
    category: row.category,
    flowerType: row.flower_type || [],
    occasion: row.occasion || [],
    isBestSeller: row.is_best_seller ?? false,
    isNew: row.is_new ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProductToDb(product: Partial<Product>): any {
  const dbData: any = {};
  if (product.name !== undefined) dbData.name = product.name;
  if (product.price !== undefined) dbData.price = product.price;
  if (product.description !== undefined) dbData.description = product.description;
  if (product.imageUrl !== undefined) dbData.image_url = product.imageUrl;
  if (product.images !== undefined) dbData.images = product.images;
  if (product.category !== undefined) dbData.category = product.category;
  if (product.flowerType !== undefined) dbData.flower_type = product.flowerType;
  if (product.occasion !== undefined) dbData.occasion = product.occasion;
  if (product.isBestSeller !== undefined) dbData.is_best_seller = product.isBestSeller;
  if (product.isNew !== undefined) dbData.is_new = product.isNew;
  return dbData;
}

export const productService = {
  async getProducts(params?: ProductFiltersParam): Promise<Product[]> {
    try {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });

      if (params?.category && params.category !== 'all') {
        query = query.eq('category', params.category);
      }
      if (params?.isBestSeller) {
        query = query.eq('is_best_seller', true);
      }
      if (params?.isNew) {
        query = query.eq('is_new', true);
      }
      if (params?.search) {
        query = query.ilike('name', `%${params.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.warn(
          'Supabase query error or table does not exist yet. Fallback to mock:',
          error.message,
        );
        return MOCK_PRODUCTS;
      }

      if (!data || data.length === 0) {
        return MOCK_PRODUCTS;
      }

      return data.map(mapProductFromDb);
    } catch (err) {
      console.warn('Error fetching products from DB. Fallback to MOCK_PRODUCTS:', err);
      return MOCK_PRODUCTS;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

      if (error || !data) {
        const mock = MOCK_PRODUCTS.find((p) => p.id === id);
        return mock || null;
      }

      return mapProductFromDb(data);
    } catch {
      const mock = MOCK_PRODUCTS.find((p) => p.id === id);
      return mock || null;
    }
  },

  async createProduct(payload: ICreateProductRequest): Promise<Product> {
    const dbPayload = mapProductToDb(payload);
    const { data, error } = await supabase.from('products').insert(dbPayload).select('*').single();

    if (error) {
      throw new Error(`Không thể tạo sản phẩm: ${error.message}`);
    }

    return mapProductFromDb(data);
  },

  async updateProduct(id: string, payload: Partial<ICreateProductRequest>): Promise<Product> {
    const dbPayload = mapProductToDb(payload);
    const { data, error } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể cập nhật sản phẩm: ${error.message}`);
    }

    return mapProductFromDb(data);
  },

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      throw new Error(`Không thể xóa sản phẩm: ${error.message}`);
    }

    return true;
  },

  async uploadProductImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new Error(`Lỗi tải ảnh lên Supabase: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);

    return data.publicUrl;
  },
};
