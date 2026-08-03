export type ProductCategory = 'bouquet' | 'basket' | 'box' | 'plant' | 'stand' | string;

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  images?: string[];
  category: ProductCategory;
  categoryId?: string;
  flowerType?: string[];
  occasion?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICreateProductRequest {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  images?: string[];
  category: ProductCategory;
  categoryId?: string;
  flowerType?: string[];
  occasion?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface IUpdateProductRequest extends Partial<ICreateProductRequest> {
  id: string;
}

export interface ProductFiltersParam {
  category?: string;
  search?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  priceMin?: number;
  priceMax?: number;
}
