import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.png';
import product1 from '@/assets/product-1.png';
import { ArrowRight } from 'lucide-react';
import { SEO } from '@/components/shared/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Về chúng tôi"
        description="Câu chuyện của Sulleybanhoa - Nơi kết nối cảm xúc qua những thiết kế hoa phong cách Hàn Quốc tối giản và tinh tế."
      />
      {/* Navigation removed */}

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#eecbcb]/20 text-[#be8e8e] text-sm font-medium tracking-wider">
                CÂU CHUYỆN CỦA CHÚNG TÔI
              </div>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight">
                Hơn cả những <br />
                <span className="italic text-[#eecbcb]">bông hoa</span> đẹp.
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                Sulley được thành lập với niềm tin rằng hoa không chỉ là món đồ trang trí vô tri, mà
                là phương tiện để truyền tải cảm xúc, kết nối con người và mang thiên nhiên vào
                không gian sống.
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                Mỗi thiết kế của chúng tôi đều mang đậm phong cách tối giản, tinh tế, tôn vinh vẻ
                đẹp tự nhiên của từng nhành hoa, chiếc lá.
              </p>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#eecbcb]/20">
                <img src={heroBg} alt="Về Sulley" className="w-full h-full object-cover" />
              </div>
              {/* Decorative */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#eecbcb] rounded-full blur-3xl opacity-30 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-[#dae5d0]/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif">Giá Trị Cốt Lõi</h2>
            <div className="w-16 h-1 bg-[#eecbcb] mx-auto" />
            <p className="text-gray-500">Những điều làm nên sự khác biệt của Sulley</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#ffe4e6] rounded-full flex items-center justify-center mb-6 text-[#eecbcb]">
                <ArrowRight />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Tươi Mới Mỗi Ngày</h3>
              <p className="text-gray-500">
                Hoa được nhập mới mỗi ngày, đảm bảo độ tươi và chất lượng tốt nhất khi đến tay khách
                hàng.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#e0f2fe] rounded-full flex items-center justify-center mb-6 text-[#38bdf8]">
                <ArrowRight />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Nghệ Thuật Tối Giản</h3>
              <p className="text-gray-500">
                Phong cách cắm hoa hiện đại, tinh tế, không rườm rà nhưng vẫn đầy cuốn hút và sang
                trọng.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#f0fdf4] rounded-full flex items-center justify-center mb-6 text-[#4ade80]">
                <ArrowRight />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Tận Tâm Phục Vụ</h3>
              <p className="text-gray-500">
                Tư vấn nhiệt tình, giao hàng cẩn thận. Sự hài lòng của bạn là niềm vui của chúng
                tôi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Image Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={product1}
              alt="Team Sulley"
              className="rounded-2xl shadow-xl w-full aspect-square object-cover"
            />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#eecbcb]/20 rounded-full -z-10" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif leading-tight">
              Đội ngũ <span className="text-[#eecbcb]">nghệ nhân</span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Tại Sulley, mỗi florist không chỉ là người thợ cắm hoa, mà là những nghệ sĩ thực thụ.
              Với đôi bàn tay khéo léo và tâm hồn yêu cái đẹp, chúng tôi biến những bông hoa thành
              những tác phẩm nghệ thuật độc đáo.
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-[#4A4A4A] text-white hover:bg-[#333] rounded-full px-8"
              >
                Liên hệ hợp tác
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
