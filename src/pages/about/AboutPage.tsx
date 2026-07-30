import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.png';
import product1 from '@/assets/product-1.png';
import { ArrowUpRight, Heart, ShieldCheck, Flower2 } from 'lucide-react';
import { SEO } from '@/components/shared/SEO';
import { useStoreSettingsQuery } from '@/hooks/useStoreSettings';
import { renderFormattedTitle } from '@/lib/utils/renderTitle';

export default function AboutPage() {
  const { data: settings } = useStoreSettingsQuery();
  const aboutConfig = settings?.about_page;

  return (
    <>
      <SEO
        title="Về chúng tôi"
        description="Câu chuyện của Sulleybanhoa - Nơi kết nối cảm xúc qua những thiết kế hoa phong cách Hàn Quốc tối giản và tinh tế."
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-dot-pattern">
        {/* Ambient background blur orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[130px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="md:col-span-6 space-y-6 text-left">
              <div className="eyebrow-tag">
                {aboutConfig?.storyEyebrow || 'CÂU CHUYỆN CỦA CHÚNG TÔI'}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
                {renderFormattedTitle(aboutConfig?.storyTitle, 'Hơn cả những {bông hoa} đẹp.')}
              </h1>
              <p className="text-base text-[#4A4A4A]/70 leading-relaxed">
                {aboutConfig?.storyParagraph1 ||
                  'Sulley được thành lập với niềm tin rằng hoa không chỉ là món đồ trang trí vô tri, mà là phương tiện để truyền tải cảm xúc, kết nối con người và mang thiên nhiên vào không gian sống.'}
              </p>
              <p className="text-base text-[#4A4A4A]/70 leading-relaxed">
                {aboutConfig?.storyParagraph2 ||
                  'Mỗi thiết kế của chúng tôi đều mang đậm phong cách tối giản Hàn Quốc, tôn vinh vẻ đẹp tự nhiên của từng nhành hoa, chiếc lá với góc nhìn tinh tế và giàu cảm xúc.'}
              </p>
            </div>

            {/* Doppelrand Hero Showcase */}
            <div className="md:col-span-6 relative">
              <div className="p-2.5 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-primary/20">
                <div className="rounded-[calc(2.5rem-0.625rem)] overflow-hidden aspect-[4/3] bg-cream">
                  <img src={heroBg} alt="Về Sulley" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Pillars Section */}
      <section className="py-20 bg-white/70 border-y border-border bg-grid-pattern relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-serif text-foreground">
              {aboutConfig?.valuesTitle || 'Giá Trị Cốt Lõi'}
            </h2>
            <p className="text-sm text-[#4A4A4A]/60">
              {aboutConfig?.valuesSubtitle || 'Những chuẩn mực tạo nên điều khác biệt tại Sulley'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-1 rounded-[2.2rem] bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="p-6 rounded-[calc(2.2rem-0.25rem)] bg-cream space-y-4 text-left h-full">
                <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark">
                  <Flower2 size={22} />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground">
                  {aboutConfig?.value1Title || 'Tươi Mới Mỗi Ngày'}
                </h3>
                <p className="text-xs text-[#4A4A4A]/70 leading-relaxed">
                  {aboutConfig?.value1Desc ||
                    'Hoa được tuyển chọn mới mỗi sáng, đảm bảo độ tươi từ 3-5 ngày khi đến tay người nhận.'}
                </p>
              </div>
            </div>

            <div className="p-1 rounded-[2.2rem] bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="p-6 rounded-[calc(2.2rem-0.25rem)] bg-cream space-y-4 text-left h-full">
                <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark">
                  <Heart size={22} />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground">
                  {aboutConfig?.value2Title || 'Nghệ Thuật Tối Giản'}
                </h3>
                <p className="text-xs text-[#4A4A4A]/70 leading-relaxed">
                  {aboutConfig?.value2Desc ||
                    'Phong cách cắm hoa Hàn Quốc hiện đại, không cầu kỳ rườm rà nhưng luôn đầy cuốn hút.'}
                </p>
              </div>
            </div>

            <div className="p-1 rounded-[2.2rem] bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="p-6 rounded-[calc(2.2rem-0.25rem)] bg-cream space-y-4 text-left h-full">
                <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground">
                  {aboutConfig?.value3Title || 'Tận Tâm Phục Vụ'}
                </h3>
                <p className="text-xs text-[#4A4A4A]/70 leading-relaxed">
                  {aboutConfig?.value3Desc ||
                    'Tư vấn kỹ lưỡng, giao hàng chu đáo. Niềm vui của quý khách là động lực lớn nhất của chúng tôi.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Florist Showcase */}
      <section className="py-20 relative overflow-hidden bg-dot-pattern">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="p-2.5 rounded-[2.5rem] bg-white border border-border shadow-xl">
                <div className="rounded-[calc(2.5rem-0.625rem)] overflow-hidden aspect-square">
                  <img
                    src={product1}
                    alt="Nghệ nhân Sulley"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
                {aboutConfig?.teamTitleMain || 'Đội ngũ'}{' '}
                <span className="text-primary-dark italic">
                  {aboutConfig?.teamTitleItalic || 'nghệ nhân cắm hoa'}
                </span>
              </h2>
              <p className="text-base text-[#4A4A4A]/70 leading-relaxed">
                {aboutConfig?.teamParagraph ||
                  'Tại Sulley, mỗi florist không chỉ là người thợ cắm hoa, mà là những người yêu cái đẹp thực thụ. Với đôi bàn tay khéo léo và tâm hồn nhạy cảm, chúng tôi biến những cành hoa thành các tác phẩm nghệ thuật đong đầy cảm xúc.'}
              </p>
              <div className="pt-2">
                <Link to="/contact">
                  <Button className="rounded-full bg-brand-dark hover:bg-[#333] text-white px-7 h-12 text-sm font-medium gap-2 group">
                    <span>Liên hệ hợp tác & tư vấn</span>
                    <ArrowUpRight
                      size={16}
                      className="group-hover:rotate-45 transition-transform"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
