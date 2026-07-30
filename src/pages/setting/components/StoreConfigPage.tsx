import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStoreSettingsQuery, useUpdateStoreSettingMutation } from '@/hooks/useStoreSettings';
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
} from '@/types/store-setting';
import { renderHeroTitle } from '@/lib/utils/renderTitle';
import {
  Loader2,
  Save,
  Store,
  Sparkles,
  ShoppingBag,
  Info,
  Eye,
  Star,
  Heart,
  Layers,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function StoreConfigPage() {
  const { data: settings, isLoading } = useStoreSettingsQuery();
  const updateMutation = useUpdateStoreSettingMutation();

  const heroForm = useForm<LandingHeroConfig>({
    defaultValues: {
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
    },
  });

  const shopForm = useForm<ShopHeaderConfig>({
    defaultValues: {
      title: 'Bộ Sưu Tập Hoa Tươi',
      subtitle: 'Khám phá các thiết kế hoa bó, giỏ hoa và hộp hoa tinh tế phong cách Hàn Quốc.',
    },
  });

  const aboutForm = useForm<AboutPageConfig>({
    defaultValues: {
      storyEyebrow: 'CÂU CHUYỆN CỦA CHÚNG TÔI',
      storyTitle: 'Hơn cả những bông hoa đẹp.',
      storyParagraph1:
        'Sulley được thành lập với niềm tin rằng hoa không chỉ là món đồ trang trí vô tri, mà là phương tiện để truyền tải cảm xúc, kết nối con người và mang thiên nhiên vào không gian sống.',
      storyParagraph2:
        'Mỗi thiết kế của chúng tôi đều mang đậm phong cách tối giản Hàn Quốc, tôn vinh vẻ đẹp tự nhiên của từng nhành hoa, chiếc lá với góc nhìn tinh tế và giàu cảm xúc.',
    },
  });

  const contactForm = useForm<StoreContactConfig>({
    defaultValues: {
      phone: '034 908 1629',
      email: 'sulleybanhoa@gmail.com',
      address: 'Quận 1, Thành phố Hồ Chí Minh',
      zaloUrl: 'https://zalo.me',
      openHours: '08:00 - 21:00 hàng ngày',
    },
  });

  const featuredForm = useForm<LandingFeaturedConfig>({
    defaultValues: {
      eyebrow: 'HOA NỔI BẬT',
      title: 'Thiết Kế Được Yêu Thích',
    },
  });

  const philosophyForm = useForm<LandingPhilosophyConfig>({
    defaultValues: {
      eyebrow: 'TRIẾT LÝ NGHỆ THUẬT',
      titleMain: 'Triết lý của',
      titleItalic: 'sự tối giản & tinh tế',
      paragraph1:
        'Chúng tôi tin rằng hoa không chỉ là vật trang trí, mà là cuộc trò chuyện giữa thiên nhiên và không gian sống của bạn. Mỗi thiết kế đều tuân theo nguyên tắc của nghệ thuật cắm hoa Hàn Quốc - chú trọng vào đường nét, khoảng trống và sự hài hòa.',
      paragraph2:
        'Từng nhành hoa được đặt để có chủ đích, tạo nên sự tĩnh tại và thanh lịch, nâng niu từng khoảnh khắc đời thường.',
    },
  });

  const pillarsForm = useForm<LandingPillarsConfig>({
    defaultValues: {
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
    },
  });

  const bouquetBuilderForm = useForm<LandingBouquetBuilderConfig>({
    defaultValues: {
      eyebrow: 'XƯỜNG CẦM HOA THU NHỏ',
      titleMain: 'Tự Tay Phối Hoa',
      titleItalic: '& Tạo Thiệp 3D',
      subtitle:
        'Trải nghiệm tự thiết kế bó hoa cá nhân hóa theo phong cách Hàn Quốc chỉ qua 4 bước đơn giản.',
    },
  });

  const occasionForm = useForm<LandingOccasionConfig>({
    defaultValues: {
      eyebrow: 'KHÁM PHÁ THEO DỊP TẶNG',
      titleMain: 'Hoa Tươi Cho',
      titleItalic: 'Từng Cột Mốc',
    },
  });

  const reviewsForm = useForm<LandingReviewsConfig>({
    defaultValues: {
      eyebrow: 'ĐÁNH GIÁ THỰC TẾT',
      title: 'Khách Hàng Nói Gì Về Sulley?',
      subtitle: 'Niềm tin & sự hài lòng của hơn 2.000+ khách hàng tại TP.HCM',
    },
  });

  useEffect(() => {
    if (settings?.landing_hero) {
      const heroData = settings.landing_hero;
      // If legacy title exists without titlePrefix/Highlight/Suffix, parse tag or set defaults
      if (
        !heroData.titlePrefix &&
        !heroData.titleHighlight &&
        !heroData.titleSuffix &&
        heroData.title
      ) {
        const match = heroData.title.match(/^(.*?)(?:\{|\*)(.*?)(?:\}|\*)(.*)$/);
        if (match) {
          heroData.titlePrefix = match[1].trim();
          heroData.titleHighlight = match[2].trim();
          heroData.titleSuffix = match[3].trim();
        } else {
          heroData.titlePrefix = heroData.title;
          heroData.titleHighlight = '';
          heroData.titleSuffix = '';
        }
      }
      heroForm.reset(heroData);
    }
    if (settings?.shop_hero) shopForm.reset(settings.shop_hero);
    if (settings?.about_page) aboutForm.reset(settings.about_page);
    if (settings?.store_contact) contactForm.reset(settings.store_contact);
    if (settings?.landing_featured) featuredForm.reset(settings.landing_featured);
    if (settings?.landing_philosophy) philosophyForm.reset(settings.landing_philosophy);
    if (settings?.landing_pillars) pillarsForm.reset(settings.landing_pillars);
    if (settings?.landing_bouquet_builder)
      bouquetBuilderForm.reset(settings.landing_bouquet_builder);
    if (settings?.landing_occasion) occasionForm.reset(settings.landing_occasion);
    if (settings?.landing_reviews) reviewsForm.reset(settings.landing_reviews);
  }, [
    settings,
    heroForm,
    shopForm,
    aboutForm,
    contactForm,
    featuredForm,
    philosophyForm,
    pillarsForm,
    bouquetBuilderForm,
    occasionForm,
    reviewsForm,
  ]);

  const handleSaveHero = async (data: LandingHeroConfig) => {
    // Generate combined title string for backwards compatibility
    const combinedTitle =
      `${data.titlePrefix || ''} {${data.titleHighlight || ''}} ${data.titleSuffix || ''}`.trim();
    const payload = {
      ...data,
      title: combinedTitle,
    };
    await updateMutation.mutateAsync({ key: 'landing_hero', value: payload });
  };

  const handleSaveShop = async (data: ShopHeaderConfig) => {
    await updateMutation.mutateAsync({ key: 'shop_hero', value: data });
  };

  const handleSaveAbout = async (data: AboutPageConfig) => {
    await updateMutation.mutateAsync({ key: 'about_page', value: data });
  };

  const handleSaveContact = async (data: StoreContactConfig) => {
    await updateMutation.mutateAsync({ key: 'store_contact', value: data });
  };

  const handleSaveFeatured = async (data: LandingFeaturedConfig) => {
    await updateMutation.mutateAsync({ key: 'landing_featured', value: data });
  };

  const handleSavePhilosophy = async (data: LandingPhilosophyConfig) => {
    await updateMutation.mutateAsync({ key: 'landing_philosophy', value: data });
  };

  const handleSavePillars = async (data: LandingPillarsConfig) => {
    await updateMutation.mutateAsync({ key: 'landing_pillars', value: data });
  };

  const handleSaveBouquetBuilder = async (data: LandingBouquetBuilderConfig) => {
    await updateMutation.mutateAsync({ key: 'landing_bouquet_builder', value: data });
  };

  const handleSaveOccasion = async (data: LandingOccasionConfig) => {
    await updateMutation.mutateAsync({ key: 'landing_occasion', value: data });
  };

  const handleSaveReviews = async (data: LandingReviewsConfig) => {
    await updateMutation.mutateAsync({ key: 'landing_reviews', value: data });
  };

  const currentHeroValues = heroForm.watch();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-muted-foreground mr-2" size={20} />
        <span className="text-xs font-medium text-muted-foreground">Đang tải cấu hình...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">
          Cấu Hình Cửa Hàng & Các Trang Website
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Quản lý thông tin liên hệ, banner và nội dung động cho các trang Landing, Shop, Giới thiệu
          và Liên hệ.
        </p>
      </div>

      <Tabs defaultValue="landing" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-card border border-border">
          <TabsTrigger value="landing" className="gap-2 text-xs">
            <Sparkles size={14} /> Trang chủ (Landing)
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2 text-xs">
            <Store size={14} /> Thông tin liên hệ
          </TabsTrigger>
          <TabsTrigger value="shop" className="gap-2 text-xs">
            <ShoppingBag size={14} /> Trang Cửa hàng
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2 text-xs">
            <Info size={14} /> Trang Giới thiệu
          </TabsTrigger>
        </TabsList>

        {/* 1. Landing Page Tab */}
        <TabsContent value="landing" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banner & Hero Trang Chủ (Landing Page)</CardTitle>
              <CardDescription>
                Tùy chỉnh tiêu đề chính (phần chữ thường, từ khoá in nghiêng hồng nghệ thuật), mô tả
                và nhãn cam kết.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={heroForm.handleSubmit(handleSaveHero)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="eyebrow">Eyebrow Tag (Dòng phụ trên tiêu đề)</Label>
                  <Input
                    id="eyebrow"
                    {...heroForm.register('eyebrow')}
                    placeholder="FLORAL BOUTIQUE COLLECTION 2026"
                  />
                </div>

                {/* 3-Part Hero Title Form Fields */}
                <div className="space-y-3 p-4 rounded-xl bg-muted/40 border border-border">
                  <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" /> Tiêu đề chính Hero (3 Phần)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cấu hình tiêu đề nghệ thuật: Phần 2 sẽ tự động hiển thị kiểu **chữ in nghiêng
                    màu hồng Peachy** kèm **gạch chân nét sóng**.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <Label htmlFor="titlePrefix" className="text-xs">
                        Phần 1: Chữ trước
                      </Label>
                      <Input
                        id="titlePrefix"
                        {...heroForm.register('titlePrefix')}
                        placeholder="Tô điểm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="titleHighlight" className="text-xs font-bold text-primary">
                        Phần 2: Từ khoá in nghiêng hồng *
                      </Label>
                      <Input
                        id="titleHighlight"
                        {...heroForm.register('titleHighlight')}
                        placeholder="khoảnh khắc"
                        className="border-primary/50 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="titleSuffix" className="text-xs">
                        Phần 3: Chữ sau
                      </Label>
                      <Input
                        id="titleSuffix"
                        {...heroForm.register('titleSuffix')}
                        placeholder="cùng thiên nhiên."
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Eye size={14} /> Xem trước hiển thị trên Trang Chủ:
                  </span>
                  <div className="p-4 rounded-lg bg-cream/30 text-center">
                    <h2 className="text-2xl sm:text-3xl font-serif text-foreground leading-tight">
                      {renderHeroTitle(currentHeroValues)}
                    </h2>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Mô tả ngắn (Hero Subtitle)</Label>
                  <Input id="subtitle" {...heroForm.register('subtitle')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="badge1">Badge cam kết 1</Label>
                    <Input id="badge1" {...heroForm.register('badge1')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge2">Badge cam kết 2</Label>
                    <Input id="badge2" {...heroForm.register('badge2')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge3">Badge cam kết 3</Label>
                    <Input id="badge3" {...heroForm.register('badge3')} />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu cấu hình Trang chủ
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card 2: BouquetBuilder Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> Section Xưởng Cắm Hoa Thu Nhỏ
              </CardTitle>
              <CardDescription>
                Tùy chỉnh eyebrow, tiêu đề và mô tả của section workshop thiết kế hoa tương tác.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={bouquetBuilderForm.handleSubmit(handleSaveBouquetBuilder)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="bbEyebrow">Eyebrow Tag</Label>
                  <Input
                    id="bbEyebrow"
                    {...bouquetBuilderForm.register('eyebrow')}
                    placeholder="XƯỞNG CẮM HOA THU NHỎ"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bbTitleMain">Phần tiêu đề 1 (chữ thường)</Label>
                    <Input
                      id="bbTitleMain"
                      {...bouquetBuilderForm.register('titleMain')}
                      placeholder="Tự Tay Phối Hoa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bbTitleItalic" className="text-primary-dark">
                      Phần tiêu đề 2 (chữ nghiêng màu)
                    </Label>
                    <Input
                      id="bbTitleItalic"
                      {...bouquetBuilderForm.register('titleItalic')}
                      placeholder="& Tạo Thiệp 3D"
                      className="border-primary/50 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bbSubtitle">Mô tả ngắn</Label>
                  <Textarea id="bbSubtitle" {...bouquetBuilderForm.register('subtitle')} rows={2} />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu section Xưởng cắm hoa
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card 3: Occasion Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart size={16} className="text-primary" /> Section Khám Phá Theo Dịp Tặng
              </CardTitle>
              <CardDescription>
                Tùy chỉnh eyebrow và tiêu đề của section danh mục hoa theo dịp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={occasionForm.handleSubmit(handleSaveOccasion)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="occasionEyebrow">Eyebrow Tag</Label>
                  <Input
                    id="occasionEyebrow"
                    {...occasionForm.register('eyebrow')}
                    placeholder="KHÁM PHÁ THEO DỊP TẶNG"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occasionTitleMain">Phần tiêu đề 1 (chữ thường)</Label>
                    <Input
                      id="occasionTitleMain"
                      {...occasionForm.register('titleMain')}
                      placeholder="Hoa Tươi Cho"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occasionTitleItalic" className="text-primary">
                      Phần tiêu đề 2 (chữ nghiêng màu hồng)
                    </Label>
                    <Input
                      id="occasionTitleItalic"
                      {...occasionForm.register('titleItalic')}
                      placeholder="Từng Cột Mốc"
                      className="border-primary/50 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu section Khám phá dịp tặng
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card 4: Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star size={16} className="text-primary" /> Section Đánh Giá Thực Tế
              </CardTitle>
              <CardDescription>
                Tùy chỉnh eyebrow, tiêu đề và dòng thống kê (số khách hàng) của section review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={reviewsForm.handleSubmit(handleSaveReviews)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewsEyebrow">Eyebrow Tag</Label>
                  <Input
                    id="reviewsEyebrow"
                    {...reviewsForm.register('eyebrow')}
                    placeholder="ĐÁNH GIÁ THỰC TẾ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewsTitle">Tiêu đề chính</Label>
                  <Input
                    id="reviewsTitle"
                    {...reviewsForm.register('title')}
                    placeholder="Khách Hàng Nói Gì Về Sulley?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewsSubtitle">Dòng mô tả / thống kê</Label>
                  <Input
                    id="reviewsSubtitle"
                    {...reviewsForm.register('subtitle')}
                    placeholder="Niềm tin & sự hài lòng của hơn 2.000+ khách hàng..."
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu section Đánh giá
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card 5: Featured Products Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star size={16} className="text-primary" /> Section Sản Phẩm Nổi Bật
              </CardTitle>
              <CardDescription>
                Tùy chỉnh eyebrow tag và tiêu đề của section "Thiết kế được yêu thích" trên trang
                chủ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={featuredForm.handleSubmit(handleSaveFeatured)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featuredEyebrow">Eyebrow Tag</Label>
                  <Input
                    id="featuredEyebrow"
                    {...featuredForm.register('eyebrow')}
                    placeholder="HOA NỔI BẬT"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredTitle">Tiêu đề section</Label>
                  <Input
                    id="featuredTitle"
                    {...featuredForm.register('title')}
                    placeholder="Thiết Kế Được Yêu Thích"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu section Sản phẩm nổi bật
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card 6: Philosophy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart size={16} className="text-secondary-dark" /> Section Triết Lý Nghệ Thuật
              </CardTitle>
              <CardDescription>
                Tùy chỉnh nội dung section triết lý: eyebrow, tiêu đề 2 phần và 2 đoạn mô tả.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={philosophyForm.handleSubmit(handleSavePhilosophy)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="philoEyebrow">Eyebrow Tag</Label>
                  <Input
                    id="philoEyebrow"
                    {...philosophyForm.register('eyebrow')}
                    placeholder="TRIẾT LÝ NGHỆ THUẬT"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="philoTitleMain">Phần tiêu đề 1 (chữ thường)</Label>
                    <Input
                      id="philoTitleMain"
                      {...philosophyForm.register('titleMain')}
                      placeholder="Triết lý của"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="philoTitleItalic" className="text-secondary-dark">
                      Phần tiêu đề 2 (chữ nghiêng màu)
                    </Label>
                    <Input
                      id="philoTitleItalic"
                      {...philosophyForm.register('titleItalic')}
                      placeholder="sự tối giản & tinh tế"
                      className="border-secondary/50 focus:border-secondary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="philoParagraph1">Đoạn văn 1</Label>
                  <Textarea
                    id="philoParagraph1"
                    {...philosophyForm.register('paragraph1')}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="philoParagraph2">Đoạn văn 2</Label>
                  <Textarea
                    id="philoParagraph2"
                    {...philosophyForm.register('paragraph2')}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu section Triết lý
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card 7: Value Pillars Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers size={16} className="text-foreground" /> Section Cam Kết Từ Sulley (4
                Pillars)
              </CardTitle>
              <CardDescription>
                Tùy chỉnh tiêu đề section và nội dung 4 cam kết dịch vụ hiển thị cuối trang chủ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={pillarsForm.handleSubmit(handleSavePillars)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pillarsSectionTitle">Tiêu đề section</Label>
                    <Input
                      id="pillarsSectionTitle"
                      {...pillarsForm.register('sectionTitle')}
                      placeholder="Cam Kết Từ Sulley"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pillarsSectionSubtitle">Mô tả phụ</Label>
                    <Input
                      id="pillarsSectionSubtitle"
                      {...pillarsForm.register('sectionSubtitle')}
                      placeholder="Trải nghiệm mua hoa an tâm & chất lượng hàng đầu"
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-muted/40 border border-border">
                  <Label className="text-sm font-semibold text-foreground">4 Cam Kết Dịch Vụ</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {([0, 1, 2, 3] as const).map((i) => (
                      <div
                        key={i}
                        className="space-y-3 p-3 rounded-lg bg-background border border-border"
                      >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Pillar {i + 1}
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor={`pillar-title-${i}`} className="text-xs">
                            Tiêu đề
                          </Label>
                          <Input
                            id={`pillar-title-${i}`}
                            {...pillarsForm.register(`pillars.${i}.title`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`pillar-desc-${i}`} className="text-xs">
                            Mô tả
                          </Label>
                          <Textarea
                            id={`pillar-desc-${i}`}
                            {...pillarsForm.register(`pillars.${i}.desc`)}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu section Cam kết
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Contact Tab */}
        <TabsContent value="contact" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Tiệm Hoa & Liên Hệ</CardTitle>
              <CardDescription>
                Cập nhật hotline, email, địa chỉ, Zalo và giờ mở cửa hiển thị trên Footer và trang
                Contact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={contactForm.handleSubmit(handleSaveContact)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Hotline / Số điện thoại</Label>
                    <Input id="phone" {...contactForm.register('phone')} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email hỗ trợ</Label>
                    <Input id="email" {...contactForm.register('email')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ tiệm hoa</Label>
                  <Input id="address" {...contactForm.register('address')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zaloUrl">Link Zalo OA / Zalo cá nhân</Label>
                    <Input id="zaloUrl" {...contactForm.register('zaloUrl')} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openHours">Giờ mở cửa</Label>
                    <Input id="openHours" {...contactForm.register('openHours')} />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu thông tin liên hệ
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Shop Page Tab */}
        <TabsContent value="shop" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Header Banner Trang Cửa Hàng (Shop Page)</CardTitle>
              <CardDescription>
                Tùy chỉnh tiêu đề và mô tả hiển thị ở đầu trang danh mục sản phẩm.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={shopForm.handleSubmit(handleSaveShop)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopTitle">Tiêu đề trang Cửa Hàng</Label>
                  <Input id="shopTitle" {...shopForm.register('title')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopSubtitle">Mô tả ngắn trang Cửa Hàng</Label>
                  <Input id="shopSubtitle" {...shopForm.register('subtitle')} />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu cấu hình Trang Cửa hàng
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. About Page Tab */}
        <TabsContent value="about" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Nội Dung Trang Giới Thiệu (About Page)</CardTitle>
              <CardDescription>
                Cập nhật câu chuyện thương hiệu và thông điệp giới thiệu tiệm hoa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={aboutForm.handleSubmit(handleSaveAbout)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storyEyebrow">Eyebrow Tag (Dòng phụ trên)</Label>
                  <Input id="storyEyebrow" {...aboutForm.register('storyEyebrow')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storyTitle">Tiêu đề câu chuyện (Story Title)</Label>
                  <Input id="storyTitle" {...aboutForm.register('storyTitle')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storyParagraph1">Đoạn văn 1</Label>
                  <Input id="storyParagraph1" {...aboutForm.register('storyParagraph1')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storyParagraph2">Đoạn văn 2</Label>
                  <Input id="storyParagraph2" {...aboutForm.register('storyParagraph2')} />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <Loader2 className="animate-spin mr-2" size={14} />
                    ) : (
                      <Save size={14} className="mr-2" />
                    )}
                    Lưu cấu hình Trang Giới thiệu
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
