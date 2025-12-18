import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#4A4A4A] text-[#FDFBF7] py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold">Sulleybanhoa</h3>
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
  );
}
