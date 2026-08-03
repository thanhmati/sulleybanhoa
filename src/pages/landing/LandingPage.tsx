import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Heart, Truck, Clock, Flower2, ShieldCheck } from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';
import { useProductsQuery } from '@/hooks/useProducts';
import { useStoreSettingsQuery } from '@/hooks/useStoreSettings';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/shared/SEO';
import { OccasionShowcase } from '@/components/landing/OccasionShowcase';
import { ProductCard } from '@/components/shop/ProductCard';
import { renderHeroTitle } from '@/lib/utils/renderTitle';
import type { LandingPillarItem } from '@/types/store-setting';

export default function LandingPage() {
  const { data: products = [] } = useProductsQuery();
  const { data: settings } = useStoreSettingsQuery();
  const hero = settings?.landing_hero;
  const featured = settings?.landing_featured;
  const philosophy = settings?.landing_philosophy;
  const pillars = settings?.landing_pillars;

  // Mouse position state for interactive parallax depth
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Calculate normalized offset from center (-0.5 to 0.5)
    const x = clientX / innerWidth - 0.5;
    const y = clientY / innerHeight - 0.5;
    setMousePos({ x, y });
  }, []);

  // Select featured products
  const featuredProducts = products
    .filter((p) => p.isBestSeller || ['1', '2', '7'].includes(p.id))
    .slice(0, 3);

  const PILLAR_ICONS = [Flower2, Heart, Truck, Clock];

  const valuePillars = (
    pillars?.pillars ??
    ([
      {
        title: 'Hoa Tươi Nhập Mới',
        desc: 'Tuyển chọn từng cành hoa nhập khẩu mỗi sáng, đảm bảo độ tươi từ 3-5 ngày.',
      },
      {
        title: 'Nghệ Thuật Hàn Quốc',
        desc: 'Thiết kế chú trọng sự tĩnh tại, khoảng trống nghệ thuật và đường nét tinh tế.',
      },
      {
        title: 'Giao Hàng Tận Nơi',
        desc: 'Vận chuyển chuyên nghiệp giữ phom dáng hoa hoàn hảo đến tay người nhận.',
      },
      {
        title: 'Thiết Kế Độc Bản',
        desc: 'Tùy chỉnh tone màu, loại hoa và thiệp viết tay theo câu chuyện riêng của bạn.',
      },
    ] as LandingPillarItem[])
  ).map((item: LandingPillarItem, i: number) => ({
    icon: PILLAR_ICONS[i] ?? Flower2,
    title: item.title,
    desc: item.desc,
  }));

  return (
    <>
      <SEO
        title="Trang chủ"
        description="Sulley Floral Studio - Tiệm hoa trên mây, mang đến những thiết kế hoa tươi tinh tế phong cách Hàn Quốc."
      />

      {/* Hero Section with Interactive Parallax Mouse Motion */}
      <section
        onMouseMove={handleMouseMove}
        className="relative pt-12 pb-24 md:py-24 overflow-hidden bg-dot-pattern"
      >
        {/* Parallax Layer 1: Ambient background blur orbs */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[120px] -z-10 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(calc(-50% + ${mousePos.x * 40}px), ${mousePos.y * 30}px, 0)`,
          }}
        />

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-8 text-left">
              {/* Eyebrow Badge */}
              <div className="eyebrow-tag">{hero?.eyebrow || 'BỘ SƯU TẬP FLOWER ART 2026'}</div>

              {/* Main Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-foreground leading-[1.15] tracking-tight">
                {renderHeroTitle(hero)}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-foreground/70 max-w-lg leading-relaxed">
                {hero?.subtitle ||
                  'Những cành hoa được tuyển chọn kỹ lưỡng, cắm nghệ thuật mang phong cách tối giản Hàn Quốc đến không gian sống của bạn.'}
              </p>

              {/* Button-in-Button CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-dark text-white rounded-full px-7 h-14 text-base font-medium shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center gap-3"
                  >
                    <span>Xem bộ sưu tập</span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
                      <ArrowUpRight size={16} />
                    </span>
                  </Button>
                </Link>

                <Link to="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border border-border bg-white/80 backdrop-blur-sm text-foreground hover:bg-white px-7 h-14 text-base font-medium transition-all"
                  >
                    Về Sulley Studio
                  </Button>
                </Link>
              </div>

              {/* Badge Bar – Cam Kết Dịch Vụ */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/80 shadow-xs text-xs font-semibold text-charcoal">
                  <Flower2 size={14} className="text-primary-dark" />
                  {hero?.badge1 || 'Hoa nhập tươi trong ngày'}
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/80 shadow-xs text-xs font-semibold text-charcoal">
                  <Truck size={14} className="text-secondary-dark" />
                  {hero?.badge2 || 'Giao hoa 2H nội thành'}
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border/80 shadow-xs text-xs font-semibold text-charcoal">
                  <ShieldCheck size={14} className="text-primary-dark" />
                  {hero?.badge3 || 'Đảm bảo hài lòng 100%'}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Container with Doppelrand Frame */}
            <div className="md:col-span-5 relative">
              <div
                className="p-3 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-primary/20 transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -15}px, 0)`,
                }}
              >
                <div className="rounded-[calc(2.5rem-0.75rem)] overflow-hidden aspect-[4/5] relative bg-cream">
                  <img
                    src={heroBg}
                    alt="Hoa tươi Hàn Quốc Sulley"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left space-y-1">
                    <p className="text-xs font-medium tracking-widest uppercase text-white/80">
                      Lựa chọn thiết kế
                    </p>
                    <p className="text-lg font-serif font-bold">Korean Floral Studio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion Showcase (Sinh Nhật, Kỷ Niệm, Khai Trương...) */}
      <OccasionShowcase />

      {/* Featured Curated Products Section */}
      <section className="py-20 bg-white/60 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-left space-y-2">
              <div className="eyebrow-tag">{featured?.eyebrow ?? 'HOA NỔI BẬT'}</div>
              <h2 className="text-3xl sm:text-4xl font-serif text-foreground">
                {featured?.title ?? 'Thiết Kế Được Yêu Thích'}
              </h2>
            </div>
            <Link to="/shop">
              <Button
                variant="ghost"
                className="text-primary-dark hover:text-foreground hover:bg-primary/10 text-sm font-medium gap-1"
              >
                Xem tất cả mẫu hoa <ArrowUpRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 relative overflow-hidden bg-dot-pattern border-t border-border">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-secondary/30 to-primary/20 rounded-full blur-[130px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-12 gap-16 items-center">
          {/* Left Staggered Doppelrand Images */}
          <div className="md:col-span-6 relative">
            <div className="p-2.5 rounded-[2.5rem] bg-white border border-border shadow-xl max-w-md mx-auto md:mx-0">
              <div className="rounded-[calc(2.5rem-0.625rem)] overflow-hidden aspect-[4/3]">
                <img
                  src={products[1]?.imageUrl || heroBg}
                  alt="Triết lý hoa"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="p-2 rounded-[2rem] bg-white border border-border shadow-2xl max-w-[260px] absolute -bottom-10 -right-4 hidden sm:block">
              <div className="rounded-[calc(2rem-0.5rem)] overflow-hidden aspect-square">
                <img src={heroBg} alt="Trang trí hoa" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="md:col-span-6 space-y-6 text-left">
            <div className="eyebrow-tag">{philosophy?.eyebrow ?? 'TRIẾT LÝ NGHỆ THUẬT'}</div>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground leading-tight">
              {philosophy?.titleMain ?? 'Triết lý của'} <br />
              <span className="italic text-secondary-dark">
                {philosophy?.titleItalic ?? 'sự tối giản & tinh tế'}
              </span>
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full" />
            <p className="text-base text-gray-600 leading-relaxed">
              {philosophy?.paragraph1 ??
                'Chúng tôi tin rằng hoa không chỉ là vật trang trí, mà là cuộc trò chuyện giữa thiên nhiên và không gian sống của bạn. Mỗi thiết kế đều tuân theo nguyên tắc của nghệ thuật cắm hoa Hàn Quốc - chú trọng vào đường nét, khoảng trống và sự hài hòa.'}
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              {philosophy?.paragraph2 ??
                'Từng nhành hoa được đặt để có chủ đích, tạo nên sự tĩnh tại và thanh lịch, nâng niu từng khoảnh khắc đời thường.'}
            </p>
            <div className="pt-2">
              <Link to="/about">
                <Button className="rounded-full bg-foreground hover:bg-[#333] text-white px-7 h-12 text-sm font-medium gap-2">
                  <span>Tìm hiểu thêm về Sulley</span>
                  <ArrowUpRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Grid Section */}
      <section className="py-20 bg-secondary/15 border-t border-secondary/30 bg-grid-pattern relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-serif text-foreground">
              {pillars?.sectionTitle ?? 'Cam Kết Từ Sulley'}
            </h2>
            <p className="text-gray-500 text-sm">
              {pillars?.sectionSubtitle ?? 'Trải nghiệm mua hoa an tâm & chất lượng hàng đầu'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuePillars.map(
              (item: { icon: React.ElementType; title: string; desc: string }, idx: number) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-1.5 rounded-[2rem] bg-white border border-secondary/40 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6 rounded-[calc(2rem-0.375rem)] bg-cream h-full text-left space-y-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark">
                        <IconComp size={22} />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-foreground">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>
    </>
  );
}
