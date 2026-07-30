import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search, X, Truck, ShieldCheck, Flower2, SlidersHorizontal } from 'lucide-react';
import { useProductsQuery } from '@/hooks/useProducts';
import { useStoreSettingsQuery } from '@/hooks/useStoreSettings';
import type { ShopHeaderConfig } from '@/types/store-setting';
import ProductFilters from '@/components/shop/ProductFilters';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductQuickViewModal } from '@/components/shop/ProductQuickViewModal';
import { SEO } from '@/components/shared/SEO';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils/formatters';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'bouquet', label: 'Hoa bó' },
  { id: 'basket', label: 'Giỏ hoa' },
  { id: 'box', label: 'Hộp hoa' },
  { id: 'plant', label: 'Cây & Lan' },
  { id: 'stand', label: 'Kệ hoa' },
];

export default function ShopPage() {
  const { data: rawProducts = [] } = useProductsQuery();
  const { data: settings } = useStoreSettingsQuery();

  const shopHero: ShopHeaderConfig = settings?.shop_hero || {
    eyebrow: 'FLORAL BOUTIQUE COLLECTION 2026',
    title: 'Bộ Sưu Tập Hoa Tươi',
    subtitle: 'Khám phá các thiết kế hoa bó, giỏ hoa và hộp hoa tinh tế phong cách Hàn Quốc.',
    badge1: 'Hoa nhập tươi trong ngày',
    badge2: 'Giao hoa 2H nội thành',
    badge3: 'Đảm bảo hài lòng 100%',
  };

  const [filters, setFilters] = useState({
    priceRange: [0, 5000000] as [number, number],
    flowerType: [] as string[],
    occasion: [] as string[],
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Calculate category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: rawProducts.length };
    rawProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [rawProducts]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    const result = rawProducts.filter((product) => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      // Price range
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      // Flower Type
      if (filters.flowerType.length > 0) {
        if (
          !product.flowerType ||
          !product.flowerType.some((t) => filters.flowerType.includes(t))
        ) {
          return false;
        }
      }
      // Occasion
      if (filters.occasion.length > 0) {
        if (!product.occasion || !product.occasion.some((o) => filters.occasion.includes(o))) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description?.toLowerCase().includes(q);
        const matchFlower = product.flowerType?.some((f) => f.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchFlower) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured
    });
  }, [filters, activeCategory, searchQuery, sortBy, rawProducts]);

  // Active filter helper
  const hasActiveFilters =
    activeCategory !== 'all' ||
    searchQuery !== '' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000000 ||
    filters.flowerType.length > 0 ||
    filters.occasion.length > 0;

  const resetAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setFilters({ priceRange: [0, 5000000], flowerType: [], occasion: [] });
  };

  return (
    <>
      <SEO title={shopHero.title || 'Cửa Hàng Hoa Tươi'} description={shopHero.subtitle || ''} />
      <div className="relative overflow-hidden bg-dot-pattern min-h-screen pb-20">
        {/* Background Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-primary/20 via-peach/30 to-secondary/20 rounded-full blur-[140px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl pt-10">
          {/* Header Hero Section */}
          <div className="text-center mb-10 space-y-4">
            {shopHero.eyebrow && <div className="eyebrow-tag shadow-xs">{shopHero.eyebrow}</div>}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground tracking-tight font-bold">
              {shopHero.title}
            </h1>
            <p className="text-foreground/75 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {shopHero.subtitle}
            </p>

            {/* Store Highlights Badge Bar */}
            <div className="pt-3 flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-charcoal">
              {shopHero.badge1 && (
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/80 shadow-xs">
                  <Flower2 size={14} className="text-primary-dark" /> {shopHero.badge1}
                </div>
              )}
              {shopHero.badge2 && (
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/80 shadow-xs">
                  <Truck size={14} className="text-secondary-dark" /> {shopHero.badge2}
                </div>
              )}
              {shopHero.badge3 && (
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/80 shadow-xs">
                  <ShieldCheck size={14} className="text-primary-dark" /> {shopHero.badge3}
                </div>
              )}
            </div>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap overflow-x-auto py-2 px-1">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 h-10 text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-charcoal font-bold shadow-md shadow-primary/30 border border-primary-dark scale-102'
                      : 'bg-white/90 text-foreground border border-border hover:border-primary/60 hover:bg-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/60 text-charcoal font-bold' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toolbar: Search, Sort & Filters Trigger */}
          <div className="mb-8 p-3 rounded-[2rem] bg-white/90 backdrop-blur-md border border-border shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm hoa, loại hoa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 rounded-full border-border/80 bg-cream text-xs h-10 focus:ring-primary focus:border-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Mobile Filter Sheet Trigger */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full bg-white border-border text-xs h-10 px-4 font-semibold text-charcoal flex items-center gap-2"
                    >
                      <SlidersHorizontal size={14} className="text-primary-dark" /> Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="overflow-y-auto p-4 bg-cream">
                    <SheetTitle className="font-serif text-xl mb-4 text-foreground">
                      Bộ Lọc Sản Phẩm
                    </SheetTitle>
                    <ProductFilters filters={filters} setFilters={setFilters} maxPrice={5000000} />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sắp xếp:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] md:w-[180px] rounded-full bg-cream border-border/80 text-xs h-10 font-medium text-charcoal">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border bg-white">
                    <SelectItem value="featured" className="text-xs">
                      Nổi bật nhất
                    </SelectItem>
                    <SelectItem value="newest" className="text-xs">
                      Mới cập nhật
                    </SelectItem>
                    <SelectItem value="bestseller" className="text-xs">
                      Bán chạy nhất
                    </SelectItem>
                    <SelectItem value="price-asc" className="text-xs">
                      Giá: Thấp đến Cao
                    </SelectItem>
                    <SelectItem value="price-desc" className="text-xs">
                      Giá: Cao đến Thấp
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs text-gray-400 font-medium">Đang lọc theo:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white border border-border text-charcoal font-medium">
                  Từ khóa: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {activeCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/30 border border-primary-dark text-charcoal font-medium">
                  Danh mục: {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                  <button onClick={() => setActiveCategory('all')} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) && (
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white border border-border text-charcoal font-medium">
                  Giá: {formatCurrency(filters.priceRange[0])} -{' '}
                  {formatCurrency(filters.priceRange[1])}
                  <button
                    onClick={() => setFilters({ ...filters, priceRange: [0, 5000000] })}
                    className="hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.flowerType.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white border border-border text-charcoal font-medium"
                >
                  Hoa: {type}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        flowerType: filters.flowerType.filter((t) => t !== type),
                      })
                    }
                    className="hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {filters.occasion.map((occ) => (
                <span
                  key={occ}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-secondary/40 border border-secondary-dark text-charcoal font-medium"
                >
                  Dịp: {occ}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        occasion: filters.occasion.filter((o) => o !== occ),
                      })
                    }
                    className="hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                className="text-xs text-primary-dark hover:underline h-7 px-2"
              >
                Xóa tất cả
              </Button>
            </div>
          )}

          {/* Main Content Layout: Sidebar + Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <ProductFilters filters={filters} setFilters={setFilters} maxPrice={5000000} />
              </div>
            </div>

            {/* Product Grid Area */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs md:text-sm font-medium text-gray-500">
                  Hiển thị{' '}
                  <span className="text-foreground font-bold">{filteredProducts.length}</span> mẫu
                  hoa tươi
                </span>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <Card className="p-8 rounded-[2.5rem] bg-white border border-border text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 text-primary-dark mx-auto flex items-center justify-center">
                    <Filter size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground">
                    Không tìm thấy mẫu hoa phù hợp
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Thử tìm kiếm với từ khóa khác hoặc bỏ một số bộ lọc khoảng giá và loại hoa đang
                    chọn.
                  </p>
                  <Button
                    onClick={resetAllFilters}
                    className="rounded-full bg-primary text-charcoal hover:bg-primary-dark hover:text-white font-semibold px-6"
                  >
                    Bỏ tất cả bộ lọc
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
