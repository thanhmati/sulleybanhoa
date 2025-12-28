import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_PRODUCTS } from '@/data/products';
import { Link } from 'react-router-dom';
import ProductFilters from '@/components/shop/ProductFilters';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { SEO } from '@/components/shared/SEO';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'bouquet', label: 'Hoa bó' },
  { id: 'basket', label: 'Giỏ hoa' },
  { id: 'box', label: 'Hộp hoa' },
  { id: 'plant', label: 'Cây & Lan' },
  { id: 'stand', label: 'Kệ hoa' },
];

export default function ShopPage() {
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000] as [number, number],
    flowerType: [] as string[],
    occasion: [] as string[],
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Calculate filtering
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category Filter (Single Select via Buttons)
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      // Price Filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      // Flower Type Filter (OR logic within types, AND logic with other filters)
      if (filters.flowerType.length > 0) {
        if (
          !product.flowerType ||
          !product.flowerType.some((t) => filters.flowerType.includes(t))
        ) {
          return false;
        }
      }
      // Occasion Filter
      if (filters.occasion.length > 0) {
        if (!product.occasion || !product.occasion.some((o) => filters.occasion.includes(o))) {
          return false;
        }
      }
      return true;
    });
  }, [filters, activeCategory]);

  return (
    <>
      <SEO
        title="Cửa hàng"
        description="Khám phá bộ sưu tập hoa tươi đa dạng: hoa bó, giỏ hoa, hoa hộp, cây cảnh và kệ hoa chúc mừng."
      />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif">Cửa Hàng</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Khám phá bộ sưu tập hoa tươi và quà tặng được tuyển chọn kỹ lưỡng của chúng tôi.
          </p>
        </div>

        {/* Categories Buttons (Restored) */}
        <div className="flex justify-center gap-3 mb-16 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-6 h-10 border transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#4A4A4A] text-white hover:bg-[#333] border-[#4A4A4A]'
                  : 'bg-white text-[#4A4A4A] border-gray-200 hover:border-[#4A4A4A] hover:bg-transparent'
              }`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" /> Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto p-2">
                <SheetTitle className="font-serif text-xl mb-4">Bộ lọc sản phẩm</SheetTitle>
                <ProductFilters filters={filters} setFilters={setFilters} maxPrice={5000000} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ProductFilters filters={filters} setFilters={setFilters} maxPrice={5000000} />
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-gray-500">Hiển thị {filteredProducts.length} sản phẩm</span>
              {/* Could add Sort here later */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group block h-full">
                  <Card className="border-none shadow-none bg-transparent overflow-hidden h-full">
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
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(product.price)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
                  <p className="text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveCategory('all');
                      setFilters({ priceRange: [0, 5000000], flowerType: [], occasion: [] });
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
