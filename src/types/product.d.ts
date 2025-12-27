export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'bouquet' | 'basket' | 'box' | 'plant' | 'stand';
  isBestSeller?: boolean;
  isNew?: boolean;
  images?: string[];
  flowerType?: string[];
  occasion?: string[];
}
