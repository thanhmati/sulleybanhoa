import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product';
import heroBg from '@/assets/hero-bg.png';
import product1 from '@/assets/product-1.png';
import product2 from '@/assets/product-2.png';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sương Mai',
    price: 450000,
    description: 'Bó hoa hồng trắng tinh khôi.',
    imageUrl: product1,
    category: 'fresh',
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'Khúc Giao Hòa',
    price: 520000,
    description: 'Sự kết hợp hoàn hảo giữa hoa hồng và cẩm chướng.',
    imageUrl: product2,
    category: 'fresh',
    isNew: true,
  },
  {
    id: '3',
    name: 'Lời Thì Thầm',
    price: 380000,
    description: 'Bó hoa nhỏ nhắn, xinh xắn.',
    imageUrl: product1,
    category: 'fresh',
  },
  {
    id: '4',
    name: 'Mùa Thu Vàng',
    price: 600000,
    description: 'Sắc vàng rực rỡ của mùa thu.',
    imageUrl: product2,
    category: 'dried',
  },
  {
    id: '5',
    name: 'Bình Gốm Xanh',
    price: 250000,
    description: 'Bình gốm thủ công màu xanh ngọc.',
    imageUrl: heroBg,
    category: 'vase',
  },
  {
    id: '6',
    name: 'Chiều Tím',
    price: 480000,
    description: 'Gam màu tím lãng mạn.',
    imageUrl: product1,
    category: 'fresh',
  },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'fresh' | 'dried' | 'vase'>('all');

  const filteredProducts =
    activeCategory === 'all'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Navigation removed */}

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif">Cửa Hàng</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Khám phá bộ sưu tập hoa tươi và quà tặng được tuyển chọn kỹ lưỡng của chúng tôi.
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-6 ${activeCategory === 'all' ? 'bg-[#4A4A4A] text-white' : 'border-[#4A4A4A] text-[#4A4A4A]'}`}
          >
            Tất cả
          </Button>
          <Button
            variant={activeCategory === 'fresh' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('fresh')}
            className={`rounded-full px-6 ${activeCategory === 'fresh' ? 'bg-[#4A4A4A] text-white' : 'border-[#4A4A4A] text-[#4A4A4A]'}`}
          >
            Hoa Tươi
          </Button>
          <Button
            variant={activeCategory === 'dried' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('dried')}
            className={`rounded-full px-6 ${activeCategory === 'dried' ? 'bg-[#4A4A4A] text-white' : 'border-[#4A4A4A] text-[#4A4A4A]'}`}
          >
            Hoa Khô
          </Button>
          <Button
            variant={activeCategory === 'vase' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('vase')}
            className={`rounded-full px-6 ${activeCategory === 'vase' ? 'bg-[#4A4A4A] text-white' : 'border-[#4A4A4A] text-[#4A4A4A]'}`}
          >
            Bình Hoa
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group border-none shadow-none bg-transparent overflow-hidden"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FDFBF7] mb-4">
                {product.isBestSeller && (
                  <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-[#4A4A4A]">
                    Bán chạy
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-4 left-4 z-10 bg-[#eecbcb] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-white">
                    Mới
                  </div>
                )}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              <CardContent className="px-1 py-0 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium font-serif group-hover:text-[#eecbcb] transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      product.price,
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
