import { useState } from 'react';
import { useProductsQuery } from '@/hooks/useProducts';
import { useStoreSettingsQuery } from '@/hooks/useStoreSettings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Heart, Gift, Sparkles, Quote, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OccasionTab {
  id: string;
  label: string;
  icon: any;
  desc: string;
}

const OCCASION_TABS: OccasionTab[] = [
  {
    id: 'Love',
    label: 'Tình Yêu & Valentine',
    icon: Heart,
    desc: 'Những bó hoa hồng ngọt ngào thay lời muốn nói.',
  },
  {
    id: 'Birthday',
    label: 'Sinh Nhật Tinh Tế',
    icon: Gift,
    desc: 'Sắc màu tươi tắn mang lại niềm vui bất ngờ.',
  },
  {
    id: 'Anniversary',
    label: 'Kỷ Niệm Ngày Cùng Nhau',
    icon: Sparkles,
    desc: 'Thiết kế sang trọng nâng niu từng khoảnh khắc đáng nhớ.',
  },
  {
    id: 'Opening',
    label: 'Khai Trương Hồng Phát',
    icon: ArrowUpRight,
    desc: 'Kệ hoa & bình hoa mang thông điệp thịnh vượng.',
  },
];

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
  const [activeTab, setActiveTab] = useState<string>('Love');
  const { data: products = [] } = useProductsQuery();
  const { data: settings } = useStoreSettingsQuery();
  const occasionConfig = settings?.landing_occasion;
  const reviewsConfig = settings?.landing_reviews;

  // Filter products by active occasion tab
  const occasionProducts = products
    .filter((p) => p.occasion && p.occasion.includes(activeTab))
    .slice(0, 3);

  const activeOccasionInfo = OCCASION_TABS.find((t) => t.id === activeTab);

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
                {activeOccasionInfo?.desc || 'Tuyển chọn những mẫu hoa tinh tế phù hợp nhất.'}
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

          {/* Occasion Tabs Switcher */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {OCCASION_TABS.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 shrink-0 transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]'
                      : 'bg-white text-foreground border border-border hover:bg-cream'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Occasion Filtered Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {occasionProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group block h-full">
                <Card className="p-2 rounded-[2rem] bg-white border border-border hover:border-primary shadow-sm hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 h-full flex flex-col justify-between">
                  <div className="relative aspect-[3/4] rounded-[calc(2rem-0.5rem)] overflow-hidden bg-cream mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-108"
                    />
                  </div>
                  <CardContent className="px-3 pb-3 space-y-2 text-left">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-primary-dark transition-colors">
                        {product.name}
                      </h3>
                      <span className="font-semibold text-sm text-foreground bg-primary/20 px-2.5 py-1 rounded-full">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
