import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Instagram, Facebook, Twitter } from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';
import product1 from '@/assets/product-1.png';
import product2 from '@/assets/product-2.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-sans selection:bg-[#eecbcb] selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#eecbcb]/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold tracking-tight text-[#4A4A4A]">
            Sulley<span className="text-[#eecbcb]">.</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide">
            <Link to="/" className="hover:text-[#eecbcb] transition-colors">
              Trang chủ
            </Link>
            <Link to="/shop" className="hover:text-[#eecbcb] transition-colors">
              Cửa hàng
            </Link>
            <Link to="/about" className="hover:text-[#eecbcb] transition-colors">
              Về chúng tôi
            </Link>
            <Link to="/contact" className="hover:text-[#eecbcb] transition-colors">
              Liên hệ
            </Link>
          </div>
          <div className="flex gap-4">{/* Login and Cart buttons removed as per request */}</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#faefe3] rounded-bl-[100px] -z-10 opacity-60" />
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-1000">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#eecbcb]/20 text-[#be8e8e] text-sm font-medium tracking-wider mb-4">
              BỘ SƯU TẬP MỚI 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-serif leading-[1.1]">
              Tô điểm <br />
              <span className="italic text-[#eecbcb]">khoảnh khắc</span> cùng thiên nhiên.
            </h1>
            <p className="text-lg text-gray-500 max-w-md leading-relaxed">
              Những bông hoa được tuyển chọn kỹ lưỡng, cắm nghệ thuật mang phong cách tối giản Hàn
              Quốc đến không gian của bạn.
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="bg-[#eecbcb] hover:bg-[#e6bwb9] text-white rounded-full px-8 h-14 text-lg shadow-xl shadow-[#eecbcb]/30 transition-all hover:-translate-y-1"
              >
                Xem bộ sưu tập
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#4A4A4A] text-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white rounded-full px-8 h-14 text-lg transition-all"
              >
                Câu chuyện
              </Button>
            </div>
          </div>
          <div className="relative animate-in slide-in-from-right duration-1000 delay-200 flex justify-center md:justify-end">
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl shadow-[#eecbcb]/20 aspect-[4/5] w-full max-w-[500px] max-h-[80vh]">
              <img
                src={heroBg}
                alt="Bình hoa phong cách Hàn Quốc"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#dae5d0] rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#eecbcb] rounded-full blur-3xl opacity-50 -z-10" />
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif">Dành riêng cho bạn</h2>
            <p className="text-gray-500">
              Mỗi bó hoa là một tác phẩm nghệ thuật độc bản, gửi gắm những cảm xúc khó nói thành
              lời.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Sương Mai', price: '450.000₫', image: product1, tag: 'Bán chạy' },
              { title: 'Khúc Giao Hòa', price: '520.000₫', image: product2, tag: 'Mới' },
              { title: 'Lời Thì Thầm', price: '380.000₫', image: product1, tag: 'Giới hạn' }, // Reusing product 1 for demo
            ].map((item, index) => (
              <Card
                key={index}
                className="group border-none shadow-none bg-transparent overflow-hidden"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FDFBF7] mb-4">
                  <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                    {item.tag}
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  {/* Add to Cart button removed */}
                </div>
                <CardContent className="px-1 py-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium font-serif group-hover:text-[#eecbcb] transition-colors">
                      {item.title}
                    </h3>
                    <span className="font-semibold">{item.price}</span>
                  </div>
                  <div className="flex gap-1 text-[#eecbcb]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="link" className="text-[#4A4A4A] text-lg hover:text-[#eecbcb] group">
              Xem tất cả{' '}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-[#dae5d0]/10">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-square bg-[#eecbcb]/10 rounded-full absolute -top-10 -left-10 w-full h-full scale-110 -z-10" />
            <div className="grid grid-cols-2 gap-4">
              <img
                src={product2}
                className="rounded-2xl mt-12 w-full h-64 object-cover shadow-lg"
                alt="Trang trí"
              />
              <img
                src={heroBg}
                className="rounded-2xl w-full h-64 object-cover shadow-lg"
                alt="Trang trí"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif leading-tight">
              Triết lý của <br />
              <span className="italic text-[#8fa886]">sự tối giản</span>
            </h2>
            <div className="w-16 h-1 bg-[#4A4A4A]/20" />
            <p className="text-lg text-gray-600 leading-relaxed">
              Chúng tôi tin rằng hoa không chỉ là vật trang trí, mà là cuộc trò chuyện giữa thiên
              nhiên và không gian sống của bạn. Mỗi thiết kế đều tuân theo nguyên tắc của nghệ thuật
              cắm hoa Hàn Quốc - chú trọng vào đường nét, khoảng trống và sự hài hòa.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Từng nhành hoa được đặt để có chủ đích, tạo nên sự tĩnh tại và thanh lịch, nâng niu
              từng khoảnh khắc đời thường.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A4A4A] text-[#FDFBF7] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold">Sulley.</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Mang sự tĩnh lặng của thiên nhiên vào ngôi nhà bạn với những thiết kế hoa tinh tế.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium tracking-wide">Cửa hàng</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Tất cả sản phẩm
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Hoa tươi
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Hoa khô
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Bình hoa
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium tracking-wide">Công ty</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Bài viết
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Điều khoản
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium tracking-wide">Đăng ký nhận tin</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="bg-white/10 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-[#eecbcb]"
                />
                <Button size="icon" className="bg-[#eecbcb] hover:bg-[#e6bcb9]">
                  <ArrowRight size={16} />
                </Button>
              </div>
              <div className="flex gap-4 pt-2">
                <Instagram
                  size={20}
                  className="text-white/60 hover:text-white cursor-pointer transition-colors"
                />
                <Facebook
                  size={20}
                  className="text-white/60 hover:text-white cursor-pointer transition-colors"
                />
                <Twitter
                  size={20}
                  className="text-white/60 hover:text-white cursor-pointer transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
            © 2024 Sulley Flower Shop. Bảo lưu mọi quyền.
          </div>
        </div>
      </footer>
    </div>
  );
}
