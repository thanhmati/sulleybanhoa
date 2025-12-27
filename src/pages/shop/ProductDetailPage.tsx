import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MOCK_PRODUCTS } from '@/data/products';
import { ArrowLeft, Star, Truck, ShieldCheck, Phone, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif mb-4">Không tìm thấy sản phẩm</h2>
        <Link to="/shop">
          <Button>Quay lai cửa hàng</Button>
        </Link>
      </div>
    );
  }

  // Get related products (same category, exclude current)
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  // Use product images if available, otherwise fallback to main image or placeholders if created in future
  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-8">
        <Link
          to="/shop"
          className="inline-flex items-center text-gray-500 hover:text-[#eecbcb] transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Quay lại cửa hàng
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-20">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-[#FDFBF7] max-h-[70vh]">
            {product.isBestSeller && (
              <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium uppercase tracking-wider text-[#4A4A4A]">
                Bán chạy
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-6 left-6 z-10 bg-[#eecbcb] px-4 py-1.5 rounded-full text-sm font-medium uppercase tracking-wider text-white">
                Mới
              </div>
            )}
            <img
              src={activeImage || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-[#eecbcb]' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-medium text-[#4A4A4A]">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  product.price,
                )}
              </span>
              <div className="w-px h-6 bg-gray-300" />
              <div className="flex gap-1 text-[#eecbcb]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <span className="text-sm text-gray-500">(50 đánh giá)</span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <Button className="flex-1 h-14 text-lg rounded-full bg-[#4A4A4A] hover:bg-[#333] transition-all hover:scale-[1.02]">
              <MessageCircle className="mr-2" size={20} />
              Liên hệ tư vấn
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-14 text-lg rounded-full border-2 border-[#4A4A4A] text-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white transition-all"
            >
              <Phone className="mr-2" size={20} />
              090.123.4567
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8 border-t border-b border-gray-100">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eecbcb]/10 flex items-center justify-center text-[#eecbcb] flex-shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-medium text-[#4A4A4A]">Giao hàng miễn phí</h4>
                <p className="text-sm text-gray-500">Cho đơn từ 500k</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eecbcb]/10 flex items-center justify-center text-[#eecbcb] flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-medium text-[#4A4A4A]">Đảm bảo độ tươi</h4>
                <p className="text-sm text-gray-500">Hoàn tiền nếu héo</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl">Thông tin thêm</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Sản phẩm được thiết kế thủ công.</li>
              <li>Hoa nhập khẩu trực tiếp, đảm bảo độ tươi 3-5 ngày.</li>
              <li>Tặng kèm thiệp chúc mừng và hướng dẫn chăm sóc.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-3xl font-serif text-center mb-12">Có thể bạn sẽ thích</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block">
                <Card className="border-none shadow-none bg-transparent overflow-hidden h-full">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FDFBF7] mb-4">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="px-1 py-0 space-y-1">
                    <h3 className="text-lg font-medium font-serif group-hover:text-[#eecbcb] transition-colors">
                      {p.name}
                    </h3>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(p.price)}
                    </span>
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
