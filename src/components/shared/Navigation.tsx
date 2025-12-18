import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#eecbcb]/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-2xl font-serif font-bold tracking-tight text-[#4A4A4A]">
          Sulleybanhoa<span className="text-[#eecbcb]">.</span>
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
        <div className="flex gap-4"></div>
      </div>
    </nav>
  );
}
