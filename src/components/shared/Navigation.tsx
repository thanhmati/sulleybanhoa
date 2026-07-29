import { Link, useLocation } from 'react-router-dom';
import { Menu, ArrowUpRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/shared/Logo';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/shop', label: 'Cửa hàng' },
    { href: '/about', label: 'Về chúng tôi' },
    { href: '/contact', label: 'Liên hệ' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 transition-all duration-300">
      <nav
        className={`max-w-6xl mx-auto rounded-full px-6 h-16 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-cream/90 backdrop-blur-xl border border-border shadow-xl shadow-black/5'
            : 'bg-cream/80 backdrop-blur-md border border-border/80 shadow-md shadow-black/[0.03]'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/">
          <Logo />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-foreground/[0.03] p-1.5 rounded-full border border-black/5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/50 font-semibold'
                    : 'text-foreground/80 hover:text-foreground hover:bg-white/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA Action Button */}
        <div className="hidden md:flex items-center">
          <Link to="/shop">
            <Button className="rounded-full bg-brand-dark hover:bg-[#333] text-white px-5 py-2.5 h-11 gap-2.5 text-sm font-medium transition-all duration-300 hover:shadow-lg shadow-black/10 group">
              <span>Khám phá ngay</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight size={14} />
              </span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-foreground hover:bg-primary/20"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[380px] p-0 border-l border-border bg-cream"
            >
              <div className="flex flex-col h-full pt-12 px-8 pb-8">
                <SheetTitle className="mb-8 text-left">
                  <Logo />
                </SheetTitle>
                <div className="flex flex-col gap-3 flex-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`text-lg font-medium px-4 py-3 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-primary text-white font-semibold shadow-md shadow-primary/30'
                            : 'text-foreground hover:bg-primary/10'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
                <div className="pt-6 border-t border-border">
                  <Link to="/shop" className="w-full">
                    <Button className="w-full rounded-2xl bg-brand-dark hover:bg-[#333] text-white h-12 text-base font-medium gap-2">
                      <span>Bộ sưu tập 2026</span>
                      <ArrowUpRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
