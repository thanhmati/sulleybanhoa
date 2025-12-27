import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/shop', label: 'Cửa hàng' },
    { href: '/about', label: 'Về chúng tôi' },
    { href: '/contact', label: 'Liên hệ' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#eecbcb]/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-[#4A4A4A]">
          sulleybanhoa<span className="text-[#eecbcb]">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`hover:text-[#eecbcb] transition-colors ${
                location.pathname === link.href ? 'text-[#eecbcb]' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#4A4A4A]">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-12">
              <div className="flex flex-col gap-8 px-6">
                <SheetTitle className="font-serif text-2xl font-bold tracking-tight text-[#4A4A4A] text-left">
                  sulleybanhoa<span className="text-[#eecbcb]">.</span>
                </SheetTitle>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`text-lg font-medium transition-colors hover:text-[#eecbcb] ${
                        location.pathname === link.href ? 'text-[#eecbcb]' : 'text-[#4A4A4A]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
