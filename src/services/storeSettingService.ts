import { supabase } from '@/lib/supabase';
import type {
  LandingHeroConfig,
  LandingFeaturedConfig,
  LandingPhilosophyConfig,
  LandingPillarsConfig,
  LandingBouquetBuilderConfig,
  LandingOccasionConfig,
  LandingReviewsConfig,
  ShopHeaderConfig,
  AboutPageConfig,
  StoreContactConfig,
  FAQItem,
  StoreSettingItem,
} from '@/types/store-setting';

const DEFAULT_LANDING_HERO: LandingHeroConfig = {
  eyebrow: 'FLORAL BOUTIQUE COLLECTION 2026',
  title: 'Tô điểm khoảnh khắc cùng thiên nhiên.',
  titlePrefix: 'Tô điểm',
  titleHighlight: 'khoảnh khắc',
  titleSuffix: 'cùng thiên nhiên.',
  subtitle:
    'Những cành hoa được tuyển chọn kỹ lưỡng, cắm nghệ thuật mang phong cách tối giản Hàn Quốc đến không gian sống của bạn.',
  badge1: 'Hoa nhập tươi trong ngày',
  badge2: 'Giao hoa 2H nội thành',
  badge3: 'Đảm bảo hài lòng 100%',
};

const DEFAULT_SHOP_HERO: ShopHeaderConfig = {
  eyebrow: 'FLORAL BOUTIQUE COLLECTION 2026',
  title: 'Bộ Sưu Tập Hoa Tươi',
  subtitle: 'Khám phá các thiết kế hoa bó, giỏ hoa và hộp hoa tinh tế phong cách Hàn Quốc.',
  badge1: 'Hoa nhập tươi trong ngày',
  badge2: 'Giao hoa 2H nội thành',
  badge3: 'Đảm bảo hài lòng 100%',
};

const DEFAULT_ABOUT_PAGE: AboutPageConfig = {
  storyEyebrow: 'CÂU CHUYỆN CỦA CHÚNG TÔI',
  storyTitle: 'Hơn cả những bông hoa đẹp.',
  storyParagraph1:
    'Sulley được thành lập với niềm tin rằng hoa không chỉ là món đồ trang trí vô tri, mà là phương tiện để truyền tải cảm xúc, kết nối con người và mang thiên nhiên vào không gian sống.',
  storyParagraph2:
    'Mỗi thiết kế của chúng tôi đều mang đậm phong cách tối giản Hàn Quốc, tôn vinh vẻ đẹp tự nhiên của từng nhành hoa, chiếc lá với góc nhìn tinh tế và giàu cảm xúc.',

  valuesTitle: 'Giá Trị Cốt Lõi',
  valuesSubtitle: 'Những chuẩn mực tạo nên điều khác biệt tại Sulley',
  value1Title: 'Tươi Mới Mỗi Ngày',
  value1Desc:
    'Hoa được tuyển chọn mới mỗi sáng, đảm bảo độ tươi từ 3-5 ngày khi đến tay người nhận.',
  value2Title: 'Nghệ Thuật Tối Giản',
  value2Desc: 'Phong cách cắm hoa Hàn Quốc hiện đại, không cầu kỳ rườm rà nhưng luôn đầy cuốn hút.',
  value3Title: 'Tận Tâm Phục Vụ',
  value3Desc:
    'Tư vấn kỹ lưỡng, giao hàng chu đáo. Niềm vui của quý khách là động lực lớn nhất của chúng tôi.',

  teamTitleMain: 'Đội ngũ',
  teamTitleItalic: 'nghệ nhân cắm hoa',
  teamParagraph:
    'Tại Sulley, mỗi florist không chỉ là người thợ cắm hoa, mà là những người yêu cái đẹp thực thụ. Với đôi bàn tay khéo léo và tâm hồn nhạy cảm, chúng tôi biến những cành hoa thành các tác phẩm nghệ thuật đong đầy cảm xúc.',
};

const DEFAULT_CONTACT: StoreContactConfig = {
  eyebrow: 'HỖ TRỢ VÀ TƯ VẤN 24/7',
  title: 'Liên Hệ VỚI SULLEY',
  subtitle:
    'Chúng tôi luôn sẵn sàng lắng nghe & tư vấn để mang đến những thiết kế hoa ưng ý nhất cho bạn.',
  phone: '034 908 1629',
  email: 'sulleybanhoa@gmail.com',
  address: '62/291 Lý Chính Thắng, P. Võ Thị Sáu, Q.3, TP.HCM',
  zaloUrl: 'https://zalo.me',
  openHours: 'Thứ 2 - CN: 8:00 - 21:00',
  mapIframeUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2761115412436!2d106.68282667551551!3d10.790151989359448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752900722c2fcf%3A0xfcb1af35d99770ae!2zVGnhu4dtIEhvYSBUcsOqbiBNw6J5!5e0!3m2!1svi!2s!4v1766046454452!5m2!1svi!2s',
  formTitle: 'Gửi tin nhắn cho chúng tôi',
  formSubtitle: 'Vui lòng điền thông tin bên dưới, florist của Sulley sẽ liên hệ lại với bạn ngay.',
};

const DEFAULT_LANDING_FEATURED: LandingFeaturedConfig = {
  eyebrow: 'HOA NỔI BẬT',
  title: 'Thiết Kế Được Yêu Thích',
};

const DEFAULT_LANDING_PHILOSOPHY: LandingPhilosophyConfig = {
  eyebrow: 'TRIẾT LÝ NGHỆ THUẬT',
  titleMain: 'Triết lý của',
  titleItalic: 'sự tối giản & tinh tế',
  paragraph1:
    'Chúng tôi tin rằng hoa không chỉ là vật trang trí, mà là cuộc trò chuyện giữa thiên nhiên và không gian sống của bạn. Mỗi thiết kế đều tuân theo nguyên tắc của nghệ thuật cắm hoa Hàn Quốc - chú trọng vào đường nét, khoảng trống và sự hài hòa.',
  paragraph2:
    'Từng nhành hoa được đặt để có chủ đích, tạo nên sự tĩnh tại và thanh lịch, nâng niu từng khoảnh khắc đời thường.',
};

const DEFAULT_LANDING_PILLARS: LandingPillarsConfig = {
  sectionTitle: 'Cam Kết Từ Sulley',
  sectionSubtitle: 'Trải nghiệm mua hoa an tâm & chất lượng hàng đầu',
  pillars: [
    {
      title: 'Hoa Tươi Nhập Mới',
      desc: 'Tuyển chọn từng cành hoa nhập khẩu mỗi sáng, đảm bảo độ tươi từ 3-5 ngày.',
    },
    {
      title: 'Nghệ Thuật Hàn Quốc',
      desc: 'Thiết kế chú trọng sự tĩnh tại, khoảng trống nghệ thuật và đường nét tinh tế.',
    },
    {
      title: 'Giao Hàng Tận Nơi',
      desc: 'Vận chuyển chuyên nghiệp giữ phom dáng hoa hoàn hảo đến tay người nhận.',
    },
    {
      title: 'Thiết Kế Độc Bản',
      desc: 'Tùy chỉnh tone màu, loại hoa và thiệp viết tay theo câu chuyện riêng của bạn.',
    },
  ],
};

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: 'Hoa có đúng mẫu như trên hình không?',
    answer:
      'Sulley cam kết hoa thành phẩm giống hình từ 85-95%. Do thuộc tính hoa theo mùa, tiệm sẽ tư vấn hoa thay thế tương đương nếu cần.',
  },
  {
    question: 'Tiệm có giao hoa nhanh trong 2 giờ không?',
    answer:
      'Có! Đơn hàng hoa bó và giỏ hoa tiêu chuẩn sẽ được giao hỏa tốc nội thành TP.HCM trong 2 giờ.',
  },
  {
    question: 'Tôi có được tặng kèm thiệp và viết lời chúc không?',
    answer:
      'Tiệm tặng kèm thiệp chúc mừng thiết kế cao cấp và hỗ trợ viết tay lời chúc theo yêu cầu hoàn toàn miễn phí.',
  },
];

const DEFAULT_LANDING_BOUQUET_BUILDER: LandingBouquetBuilderConfig = {
  eyebrow: 'XƯỜNG CẦM HOA THU NHỏ',
  titleMain: 'Tự Tay Phối Hoa',
  titleItalic: '& Tạo Thiệp 3D',
  subtitle:
    'Trải nghiệm tự thiết kế bó hoa cá nhân hóa theo phong cách Hàn Quốc chỉ qua 4 bước đơn giản.',
};

const DEFAULT_LANDING_OCCASION: LandingOccasionConfig = {
  eyebrow: 'KHÁM PHÁ THEO DỊP TẶNG',
  titleMain: 'Hoa Tươi Cho',
  titleItalic: 'Từng Cột Mốc',
};

const DEFAULT_LANDING_REVIEWS: LandingReviewsConfig = {
  eyebrow: 'ĐÁNH GIÁ THỰC TẾT',
  title: 'Khách Hàng Nói Gì Về Sulley?',
  subtitle: 'Niềm tin & sự hài lòng của hơn 2.000+ khách hàng tại TP.HCM',
};

export const storeSettingService = {
  async getSettings(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase.from('store_settings').select('*');

      const result: Record<string, any> = {
        landing_hero: DEFAULT_LANDING_HERO,
        landing_featured: DEFAULT_LANDING_FEATURED,
        landing_philosophy: DEFAULT_LANDING_PHILOSOPHY,
        landing_pillars: DEFAULT_LANDING_PILLARS,
        landing_bouquet_builder: DEFAULT_LANDING_BOUQUET_BUILDER,
        landing_occasion: DEFAULT_LANDING_OCCASION,
        landing_reviews: DEFAULT_LANDING_REVIEWS,
        shop_hero: DEFAULT_SHOP_HERO,
        about_page: DEFAULT_ABOUT_PAGE,
        store_contact: DEFAULT_CONTACT,
        landing_faqs: DEFAULT_FAQS,
      };

      if (error || !data) {
        return result;
      }

      data.forEach((row: StoreSettingItem) => {
        if (
          typeof row.value === 'object' &&
          row.value !== null &&
          !Array.isArray(row.value) &&
          result[row.key]
        ) {
          result[row.key] = { ...result[row.key], ...row.value };
        } else {
          result[row.key] = row.value;
        }
      });

      return result;
    } catch {
      return {
        landing_hero: DEFAULT_LANDING_HERO,
        landing_featured: DEFAULT_LANDING_FEATURED,
        landing_philosophy: DEFAULT_LANDING_PHILOSOPHY,
        landing_pillars: DEFAULT_LANDING_PILLARS,
        landing_bouquet_builder: DEFAULT_LANDING_BOUQUET_BUILDER,
        landing_occasion: DEFAULT_LANDING_OCCASION,
        landing_reviews: DEFAULT_LANDING_REVIEWS,
        shop_hero: DEFAULT_SHOP_HERO,
        about_page: DEFAULT_ABOUT_PAGE,
        store_contact: DEFAULT_CONTACT,
        landing_faqs: DEFAULT_FAQS,
      };
    }
  },

  async getSettingByKey<T = any>(key: string, fallbackDefault: T): Promise<T> {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('key', key)
        .single();

      if (error || !data) {
        return fallbackDefault;
      }

      return data.value as T;
    } catch {
      return fallbackDefault;
    }
  },

  async updateSetting(key: string, value: any): Promise<boolean> {
    const { error } = await supabase
      .from('store_settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
      throw new Error(`Không thể cập nhật cấu hình ${key}: ${error.message}`);
    }

    return true;
  },
};
