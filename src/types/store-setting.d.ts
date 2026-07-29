export interface LandingHeroConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge1: string;
  badge2: string;
  badge3: string;
}

export interface StoreContactConfig {
  phone: string;
  email: string;
  address: string;
  zaloUrl: string;
  openHours: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StoreSettingItem<T = any> {
  key: string;
  value: T;
  createdAt?: string;
  updatedAt?: string;
}
