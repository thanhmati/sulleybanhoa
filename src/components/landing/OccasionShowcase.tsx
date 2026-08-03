import { useState, useEffect, useRef, useMemo } from 'react';
import { useProductsQuery } from '@/hooks/useProducts';
import { useOccasionsQuery } from '@/hooks/useOccasions';
import { useStoreSettingsQuery } from '@/hooks/useStoreSettings';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Quote, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/shop/ProductCard';

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
  avatarBg: string;
}

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: '1',
    name: 'Minh Anh',
    role: 'Khách hàng thân thiết',
    rating: 5,
    comment:
      'Bó hoa Sương Mai giao tới siêu tươi, giấy gói mỏng nhẹ đúng chuẩn Hàn Quốc. Bạn gái mình thích mê luôn!',
    productName: 'Bó hoa Sương Mai',
    date: '2 ngày trước',
    avatarBg: 'bg-[#eecbcb]/40 text-[#be8e8e]',
  },
  {
    id: '2',
    name: 'Hoàng Nam',
    role: 'Đã mua hàng',
    rating: 5,
    comment:
      'Dịch vụ tư vấn Zalo siêu nhanh và tận tình. Thiệp viết tay nét chữ rất đẹp và trang nhã.',
    productName: 'Khúc Giao Hòa',
    date: '1 tuần trước',
    avatarBg: 'bg-[#dae5d0]/50 text-[#67825d]',
  },
  {
    id: '3',
    name: 'Thanh Hằng',
    role: 'Đã mua hàng',
    rating: 5,
    comment:
      'Bình hoa cắm rất có gout, tone màu pastel nhẹ nhàng sang trọng. Chắc chắn sẽ ủng hộ tiệm dài dài!',
    productName: 'Mùa Thu Vàng',
    date: '2 tuần trước',
    avatarBg: 'bg-primary/30 text-primary-dark',
  },
];

export function OccasionShowcase() {
  const [activeOccasionId, setActiveOccasionId] = useState<string>('');
  const tabsRef = useRef<HTMLDivElement>(null);
  const { data: products = [] } = useProductsQuery();
  const { data: dbOccasions = [] } = useOccasionsQuery();
  const { data: settings } = useStoreSettingsQuery();

  const occasionConfig = settings?.landing_occasion;
  const reviewsConfig = settings?.landing_reviews;

  // Filter and sort occasions by product count descending (highest product count first)
  const sortedOccasionList = useMemo(() => {
    const listWithDesc = dbOccasions.filter(
      (occ) => occ.description && occ.description.trim().length > 0,
    );
    const baseList = listWithDesc.length > 0 ? listWithDesc : dbOccasions;

    return [...baseList].sort((a, b) => {
      const countA = products.filter((p) => {
        if (!p.occasion || p.occasion.length === 0) return false;
        return p.occasion.includes(a.id) || p.occasion.includes(a.name);
      }).length;

      const countB = products.filter((p) => {
        if (!p.occasion || p.occasion.length === 0) return false;
        return p.occasion.includes(b.id) || p.occasion.includes(b.name);
      }).length;

      return countB - countA; // Sort highest count first
    });
  }, [dbOccasions, products]);

  // Scroll tabs container horizontally
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Set default active tab to highest count occasion when loaded
  useEffect(() => {
    if (sortedOccasionList.length > 0 && !activeOccasionId) {
      setActiveOccasionId(sortedOccasionList[0].id);
    }
  }, [sortedOccasionList, activeOccasionId]);

  const currentOccasion =
    sortedOccasionList.find((o) => o.id === activeOccasionId) || sortedOccasionList[0];

  // Filter products matching selected occasion (by UUID or Name)
  const occasionProducts = products
    .filter((p) => {
      if (!p.occasion || p.occasion.length === 0) return false;
      if (!currentOccasion) return true;
      return (
        p.occasion.includes(currentOccasion.id) ||
        p.occasion.includes(currentOccasion.name) ||
        (activeOccasionId && p.occasion.includes(activeOccasionId))
      );
    })
    .slice(0, 3);

  return (
    <section className="py-24 bg-cream relative overflow-hidden bg-grid-pattern">
      <div className="container mx-auto px-4 max-w-6xl space-y-20">
        {/* Section 1: Occasion Explorer Header & Tabs */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
            <div className="space-y-3">
              <div className="eyebrow-tag">
                {occasionConfig?.eyebrow ?? 'KHÁM PHÁ THEO DỊP TẶNG'}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-tight">
                {occasionConfig?.titleMain ?? 'Hoa Tươi Cho'}{' '}
                <span className="italic text-primary">
                  {occasionConfig?.titleItalic ?? 'Từng Cột Mốc'}
                </span>
              </h2>
              <p className="text-base text-gray-500 max-w-md">
                {currentOccasion?.name
                  ? `Bộ sưu tập: ${currentOccasion.name}`
                  : 'Tuyển chọn những mẫu hoa tinh tế phù hợp nhất cho từng dịp đặc biệt.'}
              </p>
            </div>

            <Link to="/shop">
              <Button
                variant="outline"
                className="rounded-full border-foreground/20 text-foreground hover:bg-foreground hover:text-white px-6 h-12 gap-2 text-sm font-medium transition-all group"
              >
                <span>Xem tất cả danh mục</span>
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Occasion Dynamic Tabs Switcher with Left/Right Scroll Controls */}
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="w-8 h-8 rounded-full bg-white border border-border/80 text-foreground hover:bg-primary/20 hover:border-primary shadow-xs flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Cuộn sang trái"
            >
              <ChevronLeft size={16} />
            </button>

            <div
              ref={tabsRef}
              className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth flex-1"
            >
              {sortedOccasionList.map((occ) => {
                const isActive = activeOccasionId === occ.id;
                const tabLabel = occ.description?.trim() || occ.name;

                // Calculate product count matching this occasion
                const count = products.filter((p) => {
                  if (!p.occasion || p.occasion.length === 0) return false;
                  return p.occasion.includes(occ.id) || p.occasion.includes(occ.name);
                }).length;

                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setActiveOccasionId(occ.id)}
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shrink-0 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-primary/30 border-2 border-primary text-primary-dark font-bold shadow-md shadow-primary/15 scale-[1.02]'
                        : 'bg-white text-gray-700 border border-border/80 hover:bg-cream hover:text-foreground hover:border-primary/40'
                    }`}
                  >
                    <span>{tabLabel}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-cream text-muted-foreground border border-border/60'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="w-8 h-8 rounded-full bg-white border border-border/80 text-foreground hover:bg-primary/20 hover:border-primary shadow-xs flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Cuộn sang phải"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Occasion Filtered Product Cards */}
          {occasionProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {occasionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/60 rounded-3xl border border-border/80">
              <p className="text-sm text-gray-500 font-serif">
                Chưa có sản phẩm nào cho dịp "{currentOccasion?.name || 'này'}".
              </p>
              <Link to="/shop" className="inline-block mt-3">
                <Button variant="link" className="text-primary-dark font-semibold text-xs">
                  Khám phá toàn bộ cửa hàng &rarr;
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Real Customer Reviews */}
        <div className="space-y-12 pt-8 border-t border-border">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="eyebrow-tag-sage">{reviewsConfig?.eyebrow ?? 'ĐÁNH GIÁ THỰC TẾ'}</div>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground">
              {reviewsConfig?.title ?? 'Khách Hàng Nói Gì Về Sulley?'}
            </h2>
            <p className="text-sm text-gray-500">
              {reviewsConfig?.subtitle ??
                'Niềm tin & sự hài lòng của hơn 2.000+ khách hàng tại TP.HCM'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-1 rounded-[2.2rem] bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500 text-left"
              >
                <div className="p-6 rounded-[calc(2.2rem-0.25rem)] bg-cream space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-semibold text-primary-dark uppercase tracking-wider">
                        Phản hồi thực tế
                      </span>
                      <Quote size={20} className="text-primary-dark/30" />
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${review.avatarBg}`}
                      >
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                          {review.name}
                          <CheckCircle2 size={12} className="text-secondary-dark" />
                        </h4>
                        <p className="text-[10px] text-gray-400">{review.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-primary-dark bg-primary/20 px-2 py-0.5 rounded-full">
                      {review.productName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
