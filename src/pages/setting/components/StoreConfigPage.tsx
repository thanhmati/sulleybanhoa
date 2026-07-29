import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useStoreSettingsQuery, useUpdateStoreSettingMutation } from '@/hooks/useStoreSettings';
import type { LandingHeroConfig, StoreContactConfig } from '@/types/store-setting';
import { Loader2, Save } from 'lucide-react';

export default function StoreConfigPage() {
  const { data: settings, isLoading } = useStoreSettingsQuery();
  const updateMutation = useUpdateStoreSettingMutation();

  const heroForm = useForm<LandingHeroConfig>({
    defaultValues: {
      eyebrow: 'FLORAL BOUTIQUE COLLECTION 2026',
      title: 'Cửa Hàng Hoa Tươi',
      subtitle:
        'Những thiết kế hoa tươi phong cách Hàn Quốc tinh tế, lưu giữ từng cảm xúc chân thành trong từng cành hoa.',
      badge1: 'Hoa nhập tươi trong ngày',
      badge2: 'Giao hoa 2H nội thành',
      badge3: 'Đảm bảo hài lòng 100%',
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
      heroForm.reset(settings.landing_hero);
    }
    if (settings?.store_contact) {
      contactForm.reset(settings.store_contact);
    }
  }, [settings, heroForm, contactForm]);

  const handleSaveHero = async (data: LandingHeroConfig) => {
    await updateMutation.mutateAsync({ key: 'landing_hero', value: data });
  };

  const handleSaveContact = async (data: StoreContactConfig) => {
    await updateMutation.mutateAsync({ key: 'store_contact', value: data });
  };

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
      {/* Contact Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Tiệm Hoa & Liên Hệ</CardTitle>
          <CardDescription>
            Cập nhật hotline, email, địa chỉ và giờ mở cửa hiển thị trên website.
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

      {/* Hero Header Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Banner & Hero Landing Page</CardTitle>
          <CardDescription>
            Tùy chỉnh các dòng tiêu đề và nhãn nổi bật trên trang Shop/Landing công khai.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={heroForm.handleSubmit(handleSaveHero)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eyebrow">Eyebrow Tag (Dòng phụ trên)</Label>
              <Input id="eyebrow" {...heroForm.register('eyebrow')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề chính (Title)</Label>
              <Input id="title" {...heroForm.register('title')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Mô tả ngắn (Subtitle)</Label>
              <Input id="subtitle" {...heroForm.register('subtitle')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badge1">Badge nổi bật 1</Label>
                <Input id="badge1" {...heroForm.register('badge1')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badge2">Badge nổi bật 2</Label>
                <Input id="badge2" {...heroForm.register('badge2')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badge3">Badge nổi bật 3</Label>
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
                Lưu cấu hình Banner
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
