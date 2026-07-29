import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  Phone,
  Check,
  Layers,
  Flower2,
  FileText,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';
import product1 from '@/assets/product-1.png';
import product2 from '@/assets/product-2.png';
import product3 from '@/assets/product-3.png';

// Options interfaces
interface ToneOption {
  id: string;
  name: string;
  colorHex: string;
  bgGradient: string;
}

interface StyleOption {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
}

interface MainFlowerOption {
  id: string;
  name: string;
  desc: string;
  priceAdd: number;
  previewImage: string;
}

interface AccentFloraOption {
  id: string;
  name: string;
  priceAdd: number;
}

const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'pastel-pink',
    name: 'Pastel Hồng Đào',
    colorHex: '#eecbcb',
    bgGradient: 'from-[#eecbcb]/30 via-white to-cream',
  },
  {
    id: 'warm-amber',
    name: 'Cam Ấm Hoàng Hôn',
    colorHex: '#f4a261',
    bgGradient: 'from-[#f4a261]/25 via-white to-cream',
  },
  {
    id: 'elegant-white',
    name: 'Trắng Tinh Khôi',
    colorHex: '#e2e8f0',
    bgGradient: 'from-[#e2e8f0]/40 via-white to-cream',
  },
  {
    id: 'soft-sage',
    name: 'Xanh Xô Thơm',
    colorHex: '#dae5d0',
    bgGradient: 'from-[#dae5d0]/35 via-white to-cream',
  },
];

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'bouquet',
    name: 'Bó Hoa Hàn Quốc',
    desc: 'Giấy gói xếp nếp nghệ thuật nhẹ nhàng.',
    basePrice: 450000,
  },
  {
    id: 'basket',
    name: 'Giỏ Hoa Mây Tre',
    desc: 'Giỏ mây tự nhiên trang nhã, dễ trưng bày.',
    basePrice: 620000,
  },
  {
    id: 'box',
    name: 'Hộp Hoa Quà Tặng',
    desc: 'Hộp nắp trong suốt sang trọng.',
    basePrice: 580000,
  },
];

const MAIN_FLOWER_OPTIONS: MainFlowerOption[] = [
  {
    id: 'rose',
    name: 'Hoa Hồng Premium',
    desc: 'Cành hoa hồng nhập khẩu cánh nở căng tràn.',
    priceAdd: 0,
    previewImage: heroBg,
  },
  {
    id: 'tulip',
    name: 'Tulip Hà Lan',
    desc: 'Đường nét tĩnh tại, quý phái phong cách Hàn Quốc.',
    priceAdd: 120000,
    previewImage: product1,
  },
  {
    id: 'peony',
    name: 'Mẫu Đơn (Peony)',
    desc: 'Cánh hoa dày kiêu sa, hương thơm dịu nhẹ.',
    priceAdd: 180000,
    previewImage: product2,
  },
  {
    id: 'carnation',
    name: 'Cẩm Chướng',
    desc: 'Vẻ đẹp dịu dàng mang thông điệp biết ơn.',
    priceAdd: 80000,
    previewImage: product3,
  },
];

const ACCENT_FLORA_OPTIONS: AccentFloraOption[] = [
  { id: 'baby', name: 'Hoa Baby Trắng', priceAdd: 50000 },
  { id: 'eucalyptus', name: 'Lá Khuynh Diệp', priceAdd: 40000 },
  { id: 'dried', name: 'Cỏ Khô Ép Nghệ Thuật', priceAdd: 30000 },
];

export function BouquetBuilder() {
  const [activeStep, setActiveStep] = useState<number>(1);

  // User selections
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(STYLE_OPTIONS[0]);
  const [selectedTone, setSelectedTone] = useState<ToneOption>(TONE_OPTIONS[0]);
  const [selectedMainFlower, setSelectedMainFlower] = useState<MainFlowerOption>(
    MAIN_FLOWER_OPTIONS[0],
  );
  const [selectedAccents, setSelectedAccents] = useState<string[]>(['baby']);

  // Card details state
  const [cardData, setCardData] = useState({
    recipient: 'Gửi người thương',
    message: 'Chúc em một ngày tràn ngập niềm vui và luôn rạng rỡ như những bông hoa!',
    sender: 'Thương gửi từ Sulley',
  });

  const toggleAccent = (id: string) => {
    setSelectedAccents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Calculate price
  const accentsPrice = selectedAccents.reduce((sum, id) => {
    const acc = ACCENT_FLORA_OPTIONS.find((a) => a.id === id);
    return sum + (acc ? acc.priceAdd : 0);
  }, 0);

  const totalPrice = selectedStyle.basePrice + selectedMainFlower.priceAdd + accentsPrice;

  // Zalo Order Message
  const zaloMessage = encodeURIComponent(
    `Chào Sulley Floral Studio, tôi thiết kế hoa qua Workshop:\n- Kiểu dáng: ${selectedStyle.name}\n- Tone màu: ${selectedTone.name}\n- Hoa chính: ${selectedMainFlower.name}\n- Hoa phụ: ${selectedAccents.map((id) => ACCENT_FLORA_OPTIONS.find((a) => a.id === id)?.name).join(', ')}\n- Thiệp lời chúc: "${cardData.message}" (Gửi: ${cardData.recipient})\n- Tổng chi phí: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}`,
  );

  return (
    <section className="py-24 relative overflow-hidden bg-white/90 border-y border-border backdrop-blur-sm bg-dot-pattern">
      {/* Background ambient glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr ${selectedTone.bgGradient} rounded-full blur-[150px] -z-10 transition-all duration-700 pointer-events-none`}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="eyebrow-tag">XƯỞNG CẮM HOA THU NHỎ</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-tight">
            Tự Tay Phối Hoa <span className="italic text-primary-dark">& Tạo Thiệp 3D</span>
          </h2>
          <p className="text-base text-gray-500 max-w-lg mx-auto">
            Trải nghiệm tự thiết kế bó hoa cá nhân hóa theo phong cách Hàn Quốc chỉ qua 4 bước đơn
            giản.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500"
              style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: 'Dáng & Gói', icon: Layers },
              { num: 2, label: 'Tuyển Chọn Hoa', icon: Flower2 },
              { num: 3, label: 'Thiệp 3D', icon: FileText },
              { num: 4, label: 'Tổng Quan', icon: Sparkles },
            ].map((step) => {
              const IconComp = step.icon;
              const isPassed = activeStep >= step.num;
              const isCurrent = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCurrent
                        ? 'bg-primary text-white ring-4 ring-primary/30 shadow-lg scale-110'
                        : isPassed
                          ? 'bg-primary/80 text-white'
                          : 'bg-white border border-border text-gray-400 group-hover:border-primary'
                    }`}
                  >
                    {isPassed ? <Check size={16} /> : <IconComp size={16} />}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:block ${
                      isCurrent
                        ? 'text-primary-dark'
                        : isPassed
                          ? 'text-foreground'
                          : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Workshop Workspace */}
        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Step Controls Panel */}
          <div className="md:col-span-7 space-y-6 text-left">
            {/* STEP 1: Dáng & Tone Màu Gói */}
            {activeStep === 1 && (
              <div className="p-6 rounded-[2rem] bg-cream border border-border space-y-6 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                  <Layers size={18} className="text-primary-dark" />
                  Bước 1: Chọn Kiểu Dáng & Tone Màu Gói
                </h3>

                {/* Style Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Kiểu Dáng Trưng Bày
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STYLE_OPTIONS.map((style) => {
                      const isSelected = selectedStyle.id === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style)}
                          className={`p-4 rounded-2xl border transition-all text-left space-y-1.5 ${
                            isSelected
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-md'
                              : 'border-border bg-white hover:bg-cream'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold font-serif text-foreground">
                              {style.name}
                            </h4>
                            {isSelected && <Check size={14} className="text-primary-dark" />}
                          </div>
                          <p className="text-[11px] text-gray-500 leading-tight">{style.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tone Selector */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Tone Màu Chủ Đạo
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TONE_OPTIONS.map((tone) => {
                      const isSelected = selectedTone.id === tone.id;
                      return (
                        <button
                          key={tone.id}
                          onClick={() => setSelectedTone(tone)}
                          className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-20 ${
                            isSelected
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-md'
                              : 'border-border bg-white hover:bg-cream'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span
                              className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                              style={{ backgroundColor: tone.colorHex }}
                            />
                            {isSelected && <Check size={14} className="text-primary-dark" />}
                          </div>
                          <span className="text-xs font-semibold text-foreground">{tone.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Chọn Loại Hoa Chính & Hoa Phụ */}
            {activeStep === 2 && (
              <div className="p-6 rounded-[2rem] bg-cream border border-border space-y-6 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                  <Flower2 size={18} className="text-primary-dark" />
                  Bước 2: Tuyển Chọn Loại Hoa & Phụ Kiện
                </h3>

                {/* Main Flower */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Hoa Chủ Đạo Chính
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MAIN_FLOWER_OPTIONS.map((flower) => {
                      const isSelected = selectedMainFlower.id === flower.id;
                      return (
                        <button
                          key={flower.id}
                          onClick={() => setSelectedMainFlower(flower)}
                          className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
                            isSelected
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-md'
                              : 'border-border bg-white hover:bg-cream'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold font-serif text-foreground">
                              {flower.name}
                            </h4>
                            {isSelected && <Check size={14} className="text-primary-dark" />}
                          </div>
                          <p className="text-[11px] text-gray-500">{flower.desc}</p>
                          {flower.priceAdd > 0 && (
                            <span className="inline-block text-[10px] font-semibold text-primary-dark bg-primary/20 px-2 py-0.5 rounded-full">
                              +
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(flower.priceAdd)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Flora */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Hoa Lá Đi Kèm (Chọn nhiều)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_FLORA_OPTIONS.map((accent) => {
                      const isSelected = selectedAccents.includes(accent.id);
                      return (
                        <button
                          key={accent.id}
                          onClick={() => toggleAccent(accent.id)}
                          className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-white text-foreground border-border hover:bg-cream'
                          }`}
                        >
                          {isSelected && <Check size={12} />}
                          <span>{accent.name}</span>
                          <span className="opacity-75">
                            (+
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(accent.priceAdd)}
                            )
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Tạo Thiệp 3D Cá Nhân Hóa */}
            {activeStep === 3 && (
              <div className="p-6 rounded-[2rem] bg-cream border border-border space-y-6 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                  <FileText size={18} className="text-primary-dark" />
                  Bước 3: Viết Lời Chúc Lên Thiệp 3D
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Tên người nhận (To):
                    </label>
                    <input
                      type="text"
                      value={cardData.recipient}
                      onChange={(e) => setCardData({ ...cardData, recipient: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Ví dụ: Gửi chị Thu Hà"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Nội dung lời nhắn chúc mừng:
                    </label>
                    <textarea
                      value={cardData.message}
                      onChange={(e) => setCardData({ ...cardData, message: e.target.value })}
                      rows={3}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Nhập những cảm xúc chân thành của bạn..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Tên người gửi (From):
                    </label>
                    <input
                      type="text"
                      value={cardData.sender}
                      onChange={(e) => setCardData({ ...cardData, sender: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Ví dụ: Từ Minh Anh"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Tổng Quan Tác Phẩm & Đặt Hàng */}
            {activeStep === 4 && (
              <div className="p-6 rounded-[2rem] bg-cream border border-border space-y-6 animate-in fade-in duration-300">
                <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
                  <Sparkles size={18} className="text-primary-dark" />
                  Bước 4: Hoàn Tất & Dự Toán Chi Phí
                </h3>

                <div className="space-y-3 bg-white p-5 rounded-2xl border border-gray-100 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Kiểu dáng:</span>
                    <span className="font-semibold text-foreground">{selectedStyle.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Tone màu gói:</span>
                    <span className="font-semibold text-foreground">{selectedTone.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Hoa chủ đạo:</span>
                    <span className="font-semibold text-foreground">{selectedMainFlower.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Hoa lá đi kèm:</span>
                    <span className="font-semibold text-foreground">
                      {selectedAccents
                        .map((id) => ACCENT_FLORA_OPTIONS.find((a) => a.id === id)?.name)
                        .join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Thiệp đi kèm:</span>
                    <span className="font-semibold text-primary-dark">Thiệp viết tay 3D</span>
                  </div>
                </div>

                {/* Direct Order Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={`https://zalo.me?text=${zaloMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full h-13 rounded-full bg-brand-dark hover:bg-[#333] text-white text-sm font-medium gap-2">
                      <MessageCircle size={16} />
                      <span>Gửi cấu hình qua Zalo</span>
                    </Button>
                  </a>

                  <a href="tel:0349081629" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-13 rounded-full border border-foreground/20 bg-white hover:bg-foreground hover:text-white text-foreground text-sm font-medium gap-2"
                    >
                      <Phone size={16} />
                      <span>Hotline: 034 908 1629</span>
                    </Button>
                  </a>
                </div>
              </div>
            )}

            {/* Stepper Navigation Controls */}
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="rounded-full border-border text-foreground px-5 h-11 gap-1"
              >
                <ChevronLeft size={16} /> Quay lại
              </Button>

              {activeStep < 4 ? (
                <Button
                  onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                  className="rounded-full bg-primary hover:bg-primary-dark text-white px-6 h-11 gap-1 font-semibold"
                >
                  <span>Tiếp theo</span>
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  onClick={() => setActiveStep(1)}
                  variant="outline"
                  className="rounded-full border-primary text-primary-dark hover:bg-primary/20 px-6 h-11 gap-1"
                >
                  <span>Phối tác phẩm mới</span>
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Live Interactive 3D Canvas Preview */}
          <div className="md:col-span-5 space-y-6">
            {/* Flower Arrangement Canvas */}
            <div className="p-2.5 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-primary/20">
              <div className="relative rounded-[calc(2.5rem-0.625rem)] overflow-hidden aspect-[4/5] bg-cream group">
                <img
                  src={selectedMainFlower.previewImage}
                  alt={selectedMainFlower.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />

                {/* Floating Selection Badges */}
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-foreground shadow-sm border border-white/60">
                    {selectedStyle.name}
                  </span>
                  <span className="bg-primary/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold shadow-sm">
                    {selectedMainFlower.name}
                  </span>
                </div>

                {/* Price Display Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/70 shadow-lg flex justify-between items-center text-left">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-dark">
                      Tổng ngân sách dự kiến
                    </p>
                    <h4 className="text-xl font-bold font-serif text-foreground">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(totalPrice)}
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-foreground bg-primary/30 px-3 py-1 rounded-full">
                    {selectedTone.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Live 3D Folded Card Preview Widget */}
            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary/30 via-white to-secondary/30 border border-border shadow-md text-left">
              <div className="p-5 rounded-[calc(2rem-0.25rem)] bg-white space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-primary-dark font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <FileText size={14} /> Thiệp chúc mừng 3D
                  </span>
                  <span className="text-[10px] text-gray-400">Viết tay nghệ thuật</span>
                </div>
                <div className="p-4 rounded-xl bg-cream border border-primary/20 space-y-2 relative">
                  <p className="text-xs font-serif font-bold text-foreground">
                    {cardData.recipient || 'Gửi người nhận...'}
                  </p>
                  <p className="text-xs text-gray-600 italic font-serif leading-relaxed">
                    "{cardData.message || 'Lời chúc của bạn...'}"
                  </p>
                  <p className="text-[11px] font-semibold text-primary-dark text-right font-serif">
                    ~ {cardData.sender || 'Người gửi'} ~
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
