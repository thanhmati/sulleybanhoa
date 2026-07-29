import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Instagram, Facebook, Heart } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export function Footer() {
  return (
    <footer className="bg-[#34302D] text-[#FDFBF7] pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Intro Column */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/">
              <Logo className="text-white [&_span]:text-white" />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Mang sự tĩnh lặng & tinh tế của thiên nhiên vào không gian sống của bạn. Mỗi bó hoa là
              một tác phẩm nghệ thuật phong cách Hàn Quốc độc bản.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#eecbcb] hover:text-white hover:border-[#eecbcb] transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#eecbcb] hover:text-white hover:border-[#eecbcb] transition-all"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-serif text-lg font-semibold tracking-wide text-white">Cửa hàng</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-[#eecbcb] transition-colors inline-flex items-center gap-1"
                >
                  Tất cả hoa <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#eecbcb] transition-colors">
                  Hoa bó Hàn Quốc
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#eecbcb] transition-colors">
                  Giỏ hoa tinh tế
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#eecbcb] transition-colors">
                  Hộp hoa quà tặng
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-serif text-lg font-semibold tracking-wide text-white">Thông tin</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link to="/about" className="hover:text-[#eecbcb] transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#eecbcb] transition-colors">
                  Liên hệ tư vấn
                </Link>
              </li>
              <li>
                <a href="#privacy" className="hover:text-[#eecbcb] transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#eecbcb] transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
            </ul>
          </div>

          {/* Doppelrand Newsletter Card */}
          <div className="md:col-span-4">
            <div className="p-1 rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/10">
              <div className="bg-[#2B2725] rounded-[calc(2rem-0.25rem)] p-6 space-y-4">
                <h4 className="font-serif text-lg font-semibold text-white flex items-center gap-2">
                  <Heart size={16} className="text-[#eecbcb]" /> Nhận ưu đãi hoa tươi
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Đăng ký email để nhận bộ sưu tập mới nhất cùng ưu đãi 10% cho đơn hàng đầu tiên.
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col sm:flex-row gap-2 pt-1"
                >
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    className="bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#eecbcb] w-full"
                  />
                  <Button className="rounded-full bg-[#eecbcb] hover:bg-[#e6bwb9] text-white px-5 py-2.5 text-sm shrink-0 font-medium transition-all">
                    Đăng ký
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 Sulley Floral Studio. Tiệm Hoa Trên Mây - All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <Heart size={12} className="text-[#eecbcb] fill-current" /> Korean Floral
            Aesthetic
          </p>
        </div>
      </div>
    </footer>
  );
}
