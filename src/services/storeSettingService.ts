import { supabase } from '@/lib/supabase';
import type {
  LandingHeroConfig,
  StoreContactConfig,
  FAQItem,
  StoreSettingItem,
} from '@/types/store-setting';

const DEFAULT_HERO: LandingHeroConfig = {
  eyebrow: 'FLORAL BOUTIQUE COLLECTION 2026',
  title: 'Cửa Hàng Hoa Tươi',
  subtitle:
    'Những thiết kế hoa tươi phong cách Hàn Quốc tinh tế, lưu giữ từng cảm xúc chân thành trong từng cành hoa.',
  badge1: 'Hoa nhập tươi trong ngày',
  badge2: 'Giao hoa 2H nội thành',
  badge3: 'Đảm bảo hài lòng 100%',
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
];

export const storeSettingService = {
  async getSettings(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase.from('store_settings').select('*');

      if (error || !data) {
        return {
          landing_hero: DEFAULT_HERO,
          store_contact: DEFAULT_CONTACT,
          landing_faqs: DEFAULT_FAQS,
        };
      }

      const result: Record<string, any> = {
        landing_hero: DEFAULT_HERO,
        store_contact: DEFAULT_CONTACT,
        landing_faqs: DEFAULT_FAQS,
      };

      data.forEach((row: StoreSettingItem) => {
        result[row.key] = row.value;
      });

      return result;
    } catch {
      return {
        landing_hero: DEFAULT_HERO,
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
