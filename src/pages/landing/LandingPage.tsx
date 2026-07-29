import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Star, Sparkles, Heart, Truck, Clock } from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';
import { MOCK_PRODUCTS } from '@/data/products';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/shared/SEO';

export default function LandingPage() {
  // Select featured products
  const featuredProducts = MOCK_PRODUCTS.filter((p) => ['1', '2', '7'].includes(p.id));

  const valuePillars = [
    {
      icon: Sparkles,
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
        description="Sulleybanhoa - Tiệm hoa trên mây, mang đến những thiết kế hoa tươi tinh tế phong cách Hàn Quốc."
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:py-24 overflow-hidden">
        {/* Ambient background blur orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#eecbcb]/30 to-[#dae5d0]/30 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-8 text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eecbcb]/25 border border-[#eecbcb]/50 text-[#be8e8e] text-xs font-semibold uppercase tracking-[0.2em]">
                <Sparkles size={12} />
                <span>BỘ SƯU TẬP FLOWER ART 2026</span>
              </div>

              {/* Main Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#4A4A4A] leading-[1.15] tracking-tight">
                Tô điểm <br />
                <span className="italic font-serif text-[#eecbcb] relative">
                  khoảnh khắc
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2 text-[#eecbcb]/40"
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
              <p className="text-base sm:text-lg text-[#4A4A4A]/70 max-w-lg leading-relaxed">
                Những cành hoa được tuyển chọn kỹ lưỡng, cắm nghệ thuật mang phong cách tối giản Hàn
                Quốc đến không gian sống của bạn.
              </p>

              {/* Button-in-Button CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="bg-[#eecbcb] hover:bg-[#e6bwb9] text-white rounded-full px-7 h-14 text-base font-medium shadow-xl shadow-[#eecbcb]/30 transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center gap-3"
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
                    className="border-2 border-[#4A4A4A]/20 bg-white/60 hover:bg-[#4A4A4A] text-[#4A4A4A] hover:text-white rounded-full px-7 h-14 text-base font-medium backdrop-blur-sm transition-all duration-300 group flex items-center gap-3"
                  >
                    <span>Câu chuyện thương hiệu</span>
                    <span className="w-8 h-8 rounded-full bg-[#4A4A4A]/10 group-hover:bg-white/20 flex items-center justify-center text-[#4A4A4A] group-hover:text-white transition-colors duration-300">
                      <ArrowUpRight size={16} />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Doppelrand Hero Showcase */}
            <div className="md:col-span-5 relative flex justify-center">
              {/* Outer Shell */}
              <div className="p-2.5 rounded-[2.5rem] bg-white/60 border border-[#eecbcb]/40 shadow-2xl shadow-[#eecbcb]/20 backdrop-blur-md w-full max-w-[440px]">
                {/* Inner Core */}
                <div className="relative rounded-[calc(2.5rem-0.625rem)] overflow-hidden aspect-[4/5] bg-[#FDFBF7]">
                  <img
                    src={heroBg}
                    alt="Bình hoa phong cách Hàn Quốc"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  />

                  {/* Floating Glass Tag Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-black/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#be8e8e]">
                        Bán chạy nhất
                      </p>
                      <h4 className="text-base font-serif font-bold text-[#4A4A4A]">
                        Sương Mai (Korea Style)
                      </h4>
                    </div>
                    <span className="text-sm font-semibold text-[#4A4A4A] bg-[#eecbcb]/30 px-3 py-1 rounded-full">
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
      <section className="py-24 bg-white/70 backdrop-blur-sm border-y border-[#eecbcb]/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#dae5d0]/30 text-[#67825d] text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={12} /> BỘ SƯU TẬP NỔI BẬT
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#4A4A4A]">Dành Riêng Cho Bạn</h2>
              <p className="text-base text-gray-500 max-w-md">
                Mỗi thiết kế là một tác phẩm nghệ thuật độc bản gửi gắm những cảm xúc chân thành.
              </p>
            </div>

            <Link to="/shop">
              <Button
                variant="outline"
                className="rounded-full border-[#4A4A4A]/20 text-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white px-6 h-12 gap-2 text-sm font-medium transition-all group"
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
                {/* Outer Shell Card */}
                <Card className="p-2 rounded-[2rem] bg-[#FDFBF7] border border-[#eecbcb]/40 hover:border-[#eecbcb] shadow-sm hover:shadow-xl hover:shadow-[#eecbcb]/20 transition-all duration-500 h-full flex flex-col justify-between">
                  {/* Inner Image Container */}
                  <div className="relative aspect-[3/4] rounded-[calc(2rem-0.5rem)] overflow-hidden bg-white mb-4">
                    {product.isBestSeller && (
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] shadow-sm border border-white/50">
                        Bán chạy
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-4 left-4 z-10 bg-[#eecbcb] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                        Mới
                      </div>
                    )}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-108"
                    />
                  </div>

                  {/* Card Content */}
                  <CardContent className="px-3 pb-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-serif font-bold text-[#4A4A4A] group-hover:text-[#be8e8e] transition-colors">
                        {product.name}
                      </h3>
                      <span className="font-semibold text-sm text-[#4A4A4A] bg-[#eecbcb]/20 px-2.5 py-1 rounded-full">
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
                      <div className="flex gap-1 text-[#eecbcb]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-[#be8e8e] group-hover:translate-x-1 transition-transform flex items-center gap-1">
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

      {/* Philosophy Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-12 gap-16 items-center">
          {/* Left Staggered Doppelrand Images */}
          <div className="md:col-span-6 relative">
            <div className="p-2.5 rounded-[2.5rem] bg-white border border-[#eecbcb]/40 shadow-xl max-w-md mx-auto md:mx-0">
              <div className="rounded-[calc(2.5rem-0.625rem)] overflow-hidden aspect-[4/3]">
                <img
                  src={MOCK_PRODUCTS[1].imageUrl}
                  alt="Triết lý hoa"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="p-2 rounded-[2rem] bg-white border border-[#eecbcb]/40 shadow-2xl max-w-[260px] absolute -bottom-10 -right-4 hidden sm:block">
              <div className="rounded-[calc(2rem-0.5rem)] overflow-hidden aspect-square">
                <img src={heroBg} alt="Trang trí hoa" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="md:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#eecbcb]/25 text-[#be8e8e] text-xs font-semibold uppercase tracking-wider">
              TRIẾT LÝ NGHỆ THUẬT
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#4A4A4A] leading-tight">
              Triết lý của <br />
              <span className="italic text-[#8fa886]">sự tối giản & tinh tế</span>
            </h2>
            <div className="w-16 h-1 bg-[#eecbcb] rounded-full" />
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
                <Button className="rounded-full bg-[#4A4A4A] hover:bg-[#333] text-white px-7 h-12 text-sm font-medium gap-2">
                  <span>Tìm hiểu thêm về Sulley</span>
                  <ArrowUpRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Grid Section */}
      <section className="py-20 bg-[#dae5d0]/15 border-t border-[#dae5d0]/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-serif text-[#4A4A4A]">Cam Kết Từ Sulley</h2>
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
                  className="p-1.5 rounded-[2rem] bg-white border border-[#dae5d0]/40 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6 rounded-[calc(2rem-0.375rem)] bg-[#FDFBF7] space-y-4 text-left h-full flex flex-col justify-between">
                    <div className="w-12 h-12 rounded-full bg-[#eecbcb]/30 text-[#be8e8e] flex items-center justify-center">
                      <IconComp size={22} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-lg text-[#4A4A4A]">{item.title}</h3>
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
