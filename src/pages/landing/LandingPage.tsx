import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Star, Heart, Truck, Clock, Flower2 } from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';
import { useProductsQuery } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/shared/SEO';
import { BouquetBuilder } from '@/components/landing/BouquetBuilder';
import { OccasionShowcase } from '@/components/landing/OccasionShowcase';

export default function LandingPage() {
  const { data: products = [] } = useProductsQuery();

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

  const valuePillars = [
    {
      icon: Flower2,
      title: 'Hoa Tươi Nhập Mới',
      desc: 'Tuyển chọn từng cành hoa nhập khẩu mỗi sáng, đảm bảo độ tươi từ 3-5 ngày.',
    },
    {
      icon: Heart,
      title: 'Nghệ Thuật Hàn Quốc',
      desc: 'Thiết kế chú trọng sự tĩnh tại, khoảng trống nghệ thuật và đường nét tinh tế.',
    },
    {
      icon: Truck,
      title: 'Giao Hàng Tận Nơi',
      desc: 'Vận chuyển chuyên nghiệp giữ phom dáng hoa hoàn hảo đến tay người nhận.',
    },
    {
      icon: Clock,
      title: 'Thiết Kế Độc Bản',
      desc: 'Tùy chỉnh tone màu, loại hoa và thiệp viết tay theo câu chuyện riêng của bạn.',
    },
  ];

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
              <div className="eyebrow-tag">BỘ SƯU TẬP FLOWER ART 2026</div>

              {/* Main Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-foreground leading-[1.15] tracking-tight">
                Tô điểm <br />
                <span className="italic font-serif text-primary relative">
                  khoảnh khắc
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2 text-primary/40"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,15 Q50,0 100,15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                </span>{' '}
                cùng thiên nhiên.
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-foreground/70 max-w-lg leading-relaxed">
                Những cành hoa được tuyển chọn kỹ lưỡng, cắm nghệ thuật mang phong cách tối giản Hàn
                Quốc đến không gian sống của bạn.
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
                    size="lg"
                    variant="outline"
                    className="border-2 border-foreground/20 bg-white/60 hover:bg-foreground text-foreground hover:text-white rounded-full px-7 h-14 text-base font-medium backdrop-blur-sm transition-all duration-300 group flex items-center gap-3"
                  >
                    <span>Câu chuyện thương hiệu</span>
                    <span className="w-8 h-8 rounded-full bg-foreground/10 group-hover:bg-white/20 flex items-center justify-center text-foreground group-hover:text-white transition-colors duration-300">
                      <ArrowUpRight size={16} />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Parallax Layer 2 & 3: Right Doppelrand Hero Showcase */}
            <div className="md:col-span-5 relative flex justify-center">
              {/* Outer Shell Card with Parallax Mouse Depth */}
              <div
                className="p-2.5 rounded-[2.5rem] bg-white/60 border border-border shadow-2xl shadow-primary/20 backdrop-blur-md w-full max-w-[440px] transition-transform duration-300 ease-out"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 10}deg) rotateX(${mousePos.y * -10}deg) translate3d(${mousePos.x * -25}px, ${mousePos.y * -20}px, 0)`,
                }}
              >
                {/* Inner Core */}
                <div className="relative rounded-[calc(2.5rem-0.625rem)] overflow-hidden aspect-[4/5] bg-cream">
                  <img
                    src={heroBg}
                    alt="Bình hoa phong cách Hàn Quốc"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  />

                  {/* Parallax Layer 3: Floating Glass Tag Badge */}
                  <div
                    className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/70 shadow-lg shadow-black/5 flex items-center justify-between transition-transform duration-300 ease-out"
                    style={{
                      transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 25}px, 15px)`,
                    }}
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">
                        Bán chạy nhất
                      </p>
                      <h4 className="text-base font-serif font-bold text-foreground">
                        Sương Mai (Korea Style)
                      </h4>
                    </div>
                    <span className="text-sm font-semibold text-foreground bg-primary/30 px-3 py-1 rounded-full">
                      580.000 đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-24 bg-white/70 backdrop-blur-sm border-y border-border bg-grid-pattern relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <div className="eyebrow-tag-sage">BỘ SƯU TẬP NỔI BẬT</div>
              <h2 className="text-3xl sm:text-4xl font-serif text-foreground">
                Dành Riêng Cho Bạn
              </h2>
              <p className="text-base text-gray-500 max-w-md">
                Mỗi thiết kế là một tác phẩm nghệ thuật độc bản gửi gắm những cảm xúc chân thành.
              </p>
            </div>

            <Link to="/shop">
              <Button
                variant="outline"
                className="rounded-full border-foreground/20 text-foreground hover:bg-foreground hover:text-white px-6 h-12 gap-2 text-sm font-medium transition-all group"
              >
                <span>Xem tất cả sản phẩm</span>
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Product Cards Grid with Doppelrand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group block h-full">
                <Card className="p-2 rounded-[2rem] bg-cream border border-border hover:border-primary shadow-sm hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 h-full flex flex-col justify-between">
                  <div className="relative aspect-[3/4] rounded-[calc(2rem-0.5rem)] overflow-hidden bg-white mb-4">
                    {product.isBestSeller && (
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm border border-white/50">
                        Bán chạy
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-4 left-4 z-10 bg-primary px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                        Mới
                      </div>
                    )}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-108"
                    />
                  </div>

                  <CardContent className="px-3 pb-3 space-y-2">
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

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex gap-1 text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-primary-dark group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Xem chi tiết <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW FEATURE 1: Interactive Bouquet Builder Customizer */}
      <BouquetBuilder />

      {/* NEW FEATURE 2: Dynamic Occasion Showcase & Live Reviews */}
      <OccasionShowcase />

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
            <div className="eyebrow-tag">TRIẾT LÝ NGHỆ THUẬT</div>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground leading-tight">
              Triết lý của <br />
              <span className="italic text-secondary-dark">sự tối giản & tinh tế</span>
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full" />
            <p className="text-base text-gray-600 leading-relaxed">
              Chúng tôi tin rằng hoa không chỉ là vật trang trí, mà là cuộc trò chuyện giữa thiên
              nhiên và không gian sống của bạn. Mỗi thiết kế đều tuân theo nguyên tắc của nghệ thuật
              cắm hoa Hàn Quốc - chú trọng vào đường nét, khoảng trống và sự hài hòa.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Từng nhành hoa được đặt để có chủ đích, tạo nên sự tĩnh tại và thanh lịch, nâng niu
              từng khoảnh khắc đời thường.
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
            <h2 className="text-3xl font-serif text-foreground">Cam Kết Từ Sulley</h2>
            <p className="text-gray-500 text-sm">
              Trải nghiệm mua hoa an tâm & chất lượng hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuePillars.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-1.5 rounded-[2rem] bg-white border border-secondary/40 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6 rounded-[calc(2rem-0.375rem)] bg-cream space-y-4 text-left h-full flex flex-col justify-between">
                    <div className="w-12 h-12 rounded-full bg-primary/30 text-primary-dark flex items-center justify-center">
                      <IconComp size={22} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-lg text-foreground">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
