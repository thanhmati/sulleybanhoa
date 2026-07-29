import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { SEO } from '@/components/shared/SEO';

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Liên hệ"
        description="Liên hệ với Sulleybanhoa để được tư vấn thiết kế hoa tươi, quà tặng phong cách Hàn Quốc. Hotline: 034 908 1629."
      />

      <div className="relative overflow-hidden bg-dot-pattern min-h-screen">
        {/* Ambient background blur orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[130px] -z-10 pointer-events-none" />

        {/* Header Banner */}
        <div className="py-16 text-center space-y-4">
          <div className="eyebrow-tag">HỖ TRỢ VÀ TƯ VẤN 24/7</div>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground">Liên Hệ VỚI SULLEY</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Chúng tôi luôn sẵn sàng lắng nghe & tư vấn để mang đến những thiết kế hoa ưng ý nhất cho
            bạn.
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-6xl pb-24">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            {/* Left Column: Contact Cards & Google Maps */}
            <div className="md:col-span-6 space-y-6">
              <h2 className="text-2xl font-serif font-bold text-foreground text-left">
                Thông tin tiệm hoa
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-1 rounded-[2rem] bg-white border border-border shadow-sm">
                  <div className="p-4 rounded-[calc(2rem-0.25rem)] bg-cream flex gap-3 items-start text-left">
                    <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark shrink-0 mt-0.5">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Địa chỉ</h3>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        62/291 Lý Chính Thắng, P. Võ Thị Sáu, Q.3, TP.HCM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-1 rounded-[2rem] bg-white border border-border shadow-sm">
                  <div className="p-4 rounded-[calc(2rem-0.25rem)] bg-cream flex gap-3 items-start text-left">
                    <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark shrink-0 mt-0.5">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Điện thoại</h3>
                      <p className="text-xs text-gray-500 mt-0.5">034 908 1629</p>
                    </div>
                  </div>
                </div>

                <div className="p-1 rounded-[2rem] bg-white border border-border shadow-sm">
                  <div className="p-4 rounded-[calc(2rem-0.25rem)] bg-cream flex gap-3 items-start text-left">
                    <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark shrink-0 mt-0.5">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Email</h3>
                      <p className="text-xs text-gray-500 mt-0.5">dotanthanhvlog@gmail.com</p>
                    </div>
                  </div>
                </div>

                <div className="p-1 rounded-[2rem] bg-white border border-border shadow-sm">
                  <div className="p-4 rounded-[calc(2rem-0.25rem)] bg-cream flex gap-3 items-start text-left">
                    <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-primary-dark shrink-0 mt-0.5">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Giờ mở cửa</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Thứ 2 - CN: 9:00 - 18:30</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map Box in Doppelrand Frame */}
              <div className="p-2 rounded-[2.2rem] bg-white border border-border shadow-md">
                <div className="w-full h-64 rounded-[calc(2.2rem-0.5rem)] overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2761115412436!2d106.68282667551551!3d10.790151989359448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752900722c2fcf%3A0xfcb1af35d99770ae!2zVGnhu4dtIEhvYSBUcsOqbiBNw6J5!5e0!3m2!1svi!2s!4v1766046454452!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-500 opacity-90 hover:opacity-100"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form (Doppelrand Container) */}
            <div className="md:col-span-6">
              <Card className="p-2 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-primary/10">
                <CardContent className="p-6 md:p-8 rounded-[calc(2.5rem-0.625rem)] bg-cream space-y-6 text-left">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      Gửi tin nhắn cho chúng tôi
                    </h3>
                    <p className="text-gray-500 text-xs">
                      Vui lòng điền thông tin bên dưới, florist của Sulley sẽ liên hệ lại với bạn
                      ngay.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                        Họ và tên
                      </Label>
                      <Input
                        id="name"
                        placeholder="Nhập họ và tên của bạn"
                        className="bg-white border border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-primary h-11 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@domain.com"
                          className="bg-white border border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-primary h-11 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-foreground">
                          Số điện thoại
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="090 123 4567"
                          className="bg-white border border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-primary h-11 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-semibold text-foreground">
                        Lời nhắn / Yêu cầu đặt hoa
                      </Label>
                      <textarea
                        id="message"
                        placeholder="Nhập nội dung tin nhắn hoặc hoa bạn cần thiết kế..."
                        className="flex min-h-[120px] w-full rounded-xl bg-white border border-gray-200 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-brand-dark hover:bg-[#333] text-white h-13 text-sm rounded-full font-medium transition-all group flex items-center justify-center gap-2"
                    >
                      <span>Gửi tin nhắn ngay</span>
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
                        <Send size={12} />
                      </span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
