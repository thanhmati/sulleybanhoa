import { supabase } from '@/lib/supabase';
import type {
  LandingHeroConfig,
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
  title: 'Bộ Sưu Tập Hoa Tươi',
  subtitle: 'Khám phá các thiết kế hoa bó, giỏ hoa và hộp hoa tinh tế phong cách Hàn Quốc.',
};

const DEFAULT_ABOUT_PAGE: AboutPageConfig = {
  storyEyebrow: 'CÂU CHUYỆN CỦA CHÚNG TÔI',
  storyTitle: 'Hơn cả những bông hoa đẹp.',
  storyParagraph1:
    'Sulley được thành lập với niềm tin rằng hoa không chỉ là món đồ trang trí vô tri, mà là phương tiện để truyền tải cảm xúc, kết nối con người và mang thiên nhiên vào không gian sống.',
  storyParagraph2:
    'Mỗi thiết kế của chúng tôi đều mang đậm phong cách tối giản Hàn Quốc, tôn vinh vẻ đẹp tự nhiên của từng nhành hoa, chiếc lá với góc nhìn tinh tế và giàu cảm xúc.',
};

const DEFAULT_CONTACT: StoreContactConfig = {
  phone: '034 908 1629',
  email: 'sulleybanhoa@gmail.com',
  address: 'Quận 1, Thành phố Hồ Chí Minh',
  zaloUrl: 'https://zalo.me',
  openHours: '08:00 - 21:00 hàng ngày',
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

export const storeSettingService = {
  async getSettings(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase.from('store_settings').select('*');

      const result: Record<string, any> = {
        landing_hero: DEFAULT_LANDING_HERO,
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
