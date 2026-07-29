import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MOCK_PRODUCTS } from '@/data/products';
import {
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SEO } from '@/components/shared/SEO';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg space-y-4">
        <h2 className="text-3xl font-serif text-[#4A4A4A]">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-500 text-sm">
          Sản phẩm bạn đang tìm kiếm có thể đã tạm ngưng hoặc không tồn tại.
        </p>
        <Link to="/shop">
          <Button className="rounded-full bg-[#4A4A4A] text-white hover:bg-[#333] px-6">
            Quay lại cửa hàng
          </Button>
        </Link>
      </div>
    );
  }

  // Get related products
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 3);

  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="container mx-auto px-4 max-w-6xl py-10">
      <SEO title={product.name} description={product.description} image={product.imageUrl} />

      {/* Back Navigation Pill */}
      <div className="mb-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#eecbcb]/40 text-xs font-medium text-[#4A4A4A] hover:bg-[#eecbcb]/10 transition-colors shadow-sm"
        >
          <ArrowLeft size={14} className="text-[#be8e8e]" />
          Quay lại danh sách sản phẩm
        </Link>
      </div>

      <div className="grid md:grid-cols-12 gap-12 items-start mb-24">
        {/* Left Gallery (Doppelrand Frame) */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-2.5 rounded-[2.5rem] bg-white border border-[#eecbcb]/40 shadow-xl shadow-[#eecbcb]/10">
            <div className="relative aspect-[4/5] rounded-[calc(2.5rem-0.625rem)] overflow-hidden bg-[#FDFBF7]">
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
                src={activeImage || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
          </div>

          {/* Thumbnails Carousel */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all p-0.5 bg-white ${
                    activeImage === img
                      ? 'border-[#eecbcb] shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details Column */}
        <div className="md:col-span-6 space-y-8 text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eecbcb]/25 text-[#be8e8e] text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} /> THIẾT KẾ HOA THỦ CÔNG
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#4A4A4A] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 flex-wrap pt-1">
              <span className="text-2xl font-bold font-serif text-[#4A4A4A] bg-[#eecbcb]/20 px-4 py-1 rounded-full">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  product.price,
                )}
              </span>

              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 text-[#eecbcb]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-500">(50 đánh giá)</span>
              </div>
            </div>

            <p className="text-gray-600 text-base leading-relaxed pt-2">{product.description}</p>
          </div>

          {/* Button-in-Button Consultation Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="flex-1">
              <Button className="w-full h-14 rounded-full bg-[#4A4A4A] hover:bg-[#333] text-white text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-3">
                <MessageCircle size={18} />
                <span>Tư vấn qua Zalo</span>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
                  <ArrowUpRight size={14} />
                </span>
              </Button>
            </a>

            <a href="tel:0349081629" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-14 rounded-full border-2 border-[#4A4A4A]/20 bg-white hover:bg-[#4A4A4A] text-[#4A4A4A] hover:text-white text-base font-medium transition-all duration-300 group flex items-center justify-center gap-3"
              >
                <Phone size={18} />
                <span>034 908 1629</span>
                <span className="w-7 h-7 rounded-full bg-[#4A4A4A]/10 group-hover:bg-white/20 flex items-center justify-center text-[#4A4A4A] group-hover:text-white transition-colors">
                  <ArrowUpRight size={14} />
                </span>
              </Button>
            </a>
          </div>

          {/* Doppelrand Trust Badges Grid */}
          <div className="p-1 rounded-[2rem] bg-white border border-[#eecbcb]/30 shadow-sm">
            <div className="p-5 rounded-[calc(2rem-0.25rem)] bg-[#FDFBF7] grid grid-cols-2 gap-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#eecbcb]/30 flex items-center justify-center text-[#be8e8e] shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#4A4A4A]">Giao hàng miễn phí</h4>
                  <p className="text-[11px] text-gray-500">Cho đơn từ 500k</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#eecbcb]/30 flex items-center justify-center text-[#be8e8e] shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#4A4A4A]">Đảm bảo độ tươi</h4>
                  <p className="text-[11px] text-gray-500">Cam kết 3-5 ngày tươi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Care Guide */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-lg font-bold text-[#4A4A4A]">Hướng dẫn bảo quản</h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-600 leading-relaxed">
              <li>Đặt hoa ở nơi thoáng mát, tránh ánh nắng trực tiếp và luồng gió máy lạnh.</li>
              <li>Thay nước sạch hàng ngày và cắt bớt cành hoa 1cm theo góc nghiêng 45 độ.</li>
              <li>Tặng kèm thiệp chúc mừng thiết kế riêng theo yêu cầu.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-[#eecbcb]/20">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-serif text-[#4A4A4A]">Có Thể Bạn Sẽ Thích</h2>
            <p className="text-xs text-gray-500">Những thiết kế hoa cùng phong cách tinh tế</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block">
                <Card className="p-2 rounded-[2rem] bg-white border border-[#eecbcb]/40 hover:border-[#eecbcb] shadow-sm hover:shadow-xl hover:shadow-[#eecbcb]/20 transition-all duration-500 h-full flex flex-col justify-between">
                  <div className="relative aspect-[3/4] rounded-[calc(2rem-0.5rem)] overflow-hidden bg-[#FDFBF7] mb-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-108"
                    />
                  </div>
                  <CardContent className="px-3 pb-3 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-serif font-bold text-[#4A4A4A] group-hover:text-[#be8e8e] transition-colors">
                        {p.name}
                      </h3>
                      <span className="font-semibold text-xs text-[#4A4A4A] bg-[#eecbcb]/20 px-2 py-0.5 rounded-full">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(p.price)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
