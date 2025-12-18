export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'fresh' | 'dried' | 'vase';
  isBestSeller?: boolean;
  isNew?: boolean;
}
