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
  ShopHeaderConfig,
  AboutPageConfig,
  StoreContactConfig,
} from '@/types/store-setting';
import { renderHeroTitle } from '@/lib/utils/renderTitle';
import { Loader2, Save, Store, Sparkles, ShoppingBag, Info, Eye } from 'lucide-react';

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
  }, [settings, heroForm, shopForm, aboutForm, contactForm]);

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
