import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_PRODUCTS } from '@/data/products';
import { Link } from 'react-router-dom';
import ProductFilters from '@/components/shop/ProductFilters';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Filter, Star, ArrowUpRight } from 'lucide-react';
import { SEO } from '@/components/shared/SEO';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả hoa' },
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

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      if (filters.flowerType.length > 0) {
        if (
          !product.flowerType ||
          !product.flowerType.some((t) => filters.flowerType.includes(t))
        ) {
          return false;
        }
      }
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
        description="Khám phá bộ sưu tập hoa tươi đa dạng: hoa bó, giỏ hoa, hoa hộp, cây cảnh và kệ hoa chúc mừng phong cách Hàn Quốc."
      />
      <div className="relative overflow-hidden bg-dot-pattern min-h-screen">
        {/* Ambient background blur orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[130px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl py-12">
          {/* Header Hero Banner */}
          <div className="text-center mb-12 space-y-4">
            <div className="eyebrow-tag">BỘ SƯU TẬP HOA TƯƠI 2026</div>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground">Cửa Hàng Hoa</h1>
            <p className="text-foreground/70 max-w-xl mx-auto text-base">
              Khám phá những thiết kế hoa tươi tinh tế được chăm chút tỉ mỉ cho từng sự kiện đặc
              biệt của bạn.
            </p>
          </div>

          {/* Categories Pills Switcher */}
          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-5 h-10 text-sm transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white font-semibold shadow-lg shadow-primary/40 hover:bg-primary-dark'
                    : 'bg-white/80 text-foreground border border-border hover:border-primary hover:bg-white'
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
                  <Button className="w-full rounded-full bg-white border border-border text-foreground shadow-sm">
                    <Filter className="mr-2 h-4 w-4 text-primary-dark" /> Bộ lọc sản phẩm
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto p-4 bg-cream">
                  <SheetTitle className="font-serif text-xl mb-4 text-foreground">
                    Bộ Lọc
                  </SheetTitle>
                  <ProductFilters filters={filters} setFilters={setFilters} maxPrice={5000000} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <ProductFilters filters={filters} setFilters={setFilters} maxPrice={5000000} />
              </div>
            </div>

            {/* Product Grid Area */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between px-1">
                <span className="text-sm font-medium text-gray-500">
                  Hiển thị{' '}
                  <span className="text-foreground font-bold">{filteredProducts.length}</span> sản
                  phẩm
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group block h-full"
                  >
                    {/* Outer Shell */}
                    <Card className="p-2 rounded-[2rem] bg-white border border-border hover:border-primary shadow-sm hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 h-full flex flex-col justify-between">
                      {/* Inner Image Container */}
                      <div className="relative aspect-[3/4] rounded-[calc(2rem-0.5rem)] overflow-hidden bg-cream mb-3">
                        {product.isBestSeller && (
                          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-foreground shadow-sm border border-white/50">
                            Bán chạy
                          </div>
                        )}
                        {product.isNew && (
                          <div className="absolute top-3 left-3 z-10 bg-primary px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
                            Mới
                          </div>
                        )}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-108"
                        />
                      </div>

                      {/* Content */}
                      <CardContent className="px-3 pb-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-serif font-bold text-foreground group-hover:text-primary-dark transition-colors">
                            {product.name}
                          </h3>
                          <span className="font-semibold text-xs text-foreground bg-primary/25 px-2.5 py-1 rounded-full shrink-0">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(product.price)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <div className="flex gap-0.5 text-primary">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-primary-dark group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            Chi tiết <ArrowUpRight size={12} />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full p-2 rounded-[2.5rem] bg-white border border-border text-center py-16 space-y-4">
                    <p className="text-base text-gray-500 font-serif">
                      Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-full border-foreground/20 text-foreground"
                      onClick={() => {
                        setActiveCategory('all');
                        setFilters({ priceRange: [0, 5000000], flowerType: [], occasion: [] });
                      }}
                    >
                      Xóa tất cả bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
