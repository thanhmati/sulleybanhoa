export interface LandingHeroConfig {
  eyebrow: string;
  title?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle: string;
  badge1: string;
  badge2: string;
  badge3: string;
}

export interface ShopHeaderConfig {
  title: string;
  subtitle: string;
}

export interface AboutPageConfig {
  storyEyebrow: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
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
