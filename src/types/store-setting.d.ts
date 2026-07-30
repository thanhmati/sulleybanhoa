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
  eyebrow?: string;
  title: string;
  subtitle: string;
  badge1?: string;
  badge2?: string;
  badge3?: string;
}

export interface AboutPageConfig {
  storyEyebrow: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;

  valuesTitle?: string;
  valuesSubtitle?: string;
  value1Title?: string;
  value1Desc?: string;
  value2Title?: string;
  value2Desc?: string;
  value3Title?: string;
  value3Desc?: string;

  teamTitleMain?: string;
  teamTitleItalic?: string;
  teamParagraph?: string;
}

export interface StoreContactConfig {
  phone: string;
  email: string;
  address: string;
  zaloUrl: string;
  openHours: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  mapIframeUrl?: string;
  formTitle?: string;
  formSubtitle?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LandingFeaturedConfig {
  eyebrow: string;
  title: string;
}

export interface LandingPhilosophyConfig {
  eyebrow: string;
  titleMain: string;
  titleItalic: string;
  paragraph1: string;
  paragraph2: string;
}

export interface LandingPillarItem {
  title: string;
  desc: string;
}

export interface LandingPillarsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  pillars: LandingPillarItem[];
}

export interface LandingBouquetBuilderConfig {
  eyebrow: string;
  titleMain: string;
  titleItalic: string;
  subtitle: string;
}

export interface LandingOccasionConfig {
  eyebrow: string;
  titleMain: string;
  titleItalic: string;
}

export interface LandingReviewsConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface StoreSettingItem<T = any> {
  key: string;
  value: T;
  createdAt?: string;
  updatedAt?: string;
}
