import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      {/* Navigation removed */}

      {/* Hero / Header */}
      <div className="bg-[#dae5d0]/20 py-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif">Liên Hệ</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn. Hãy để lại tin nhắn hoặc ghé thăm cửa
            hàng của chúng tôi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold">Thông tin liên hệ</h2>
              <div className="flex gap-4 items-start">
                <div className="bg-[#eecbcb]/10 p-3 rounded-full text-[#eecbcb] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Địa chỉ</h3>
                  <p className="text-gray-500">
                    62/291 Lý Chính Thắng, phường Võ Thị Sáu, quận 3, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#eecbcb]/10 p-3 rounded-full text-[#eecbcb] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Điện thoại</h3>
                  <p className="text-gray-500">034 908 1629</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#eecbcb]/10 p-3 rounded-full text-[#eecbcb] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-500">dotanthanhvlog@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#eecbcb]/10 p-3 rounded-full text-[#eecbcb] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Giờ mở cửa</h3>
                  <p className="text-gray-500">Thứ 2 - Chủ Nhật: 9:00 - 18:30</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2761115412436!2d106.68282667551551!3d10.790151989359448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752900722c2fcf%3A0xfcb1af35d99770ae!2zVGnhu4dtIEhvYSBUcsOqbiBNw6J5!5e0!3m2!1svi!2s!4v1766046454452!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-none shadow-xl bg-white p-6 md:p-8 rounded-3xl">
            <CardContent className="p-0 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold">Gửi tin nhắn</h3>
                <p className="text-gray-500 text-sm">
                  Điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất có thể.
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    placeholder="Nhập họ tên của bạn"
                    className="bg-[#FDFBF7] border-none focus-visible:ring-1 focus-visible:ring-[#eecbcb]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="bg-[#FDFBF7] border-none focus-visible:ring-1 focus-visible:ring-[#eecbcb]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    className="bg-[#FDFBF7] border-none focus-visible:ring-1 focus-visible:ring-[#eecbcb]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Lời nhắn</Label>
                  <textarea
                    id="message"
                    placeholder="Nội dung lời nhắn..."
                    className="flex min-h-[120px] w-full rounded-md bg-[#FDFBF7] px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#eecbcb] disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#4A4A4A] hover:bg-[#333] text-white h-12 text-base rounded-lg group"
                >
                  Gửi tin nhắn
                  <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
