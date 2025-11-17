import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRoundCog, Store, KeyRoundIcon } from 'lucide-react';
import { useQueryParams } from '@/hooks/useQueryParams';
import ProfilePage from './components/ProfilePage';
import ChangePasswordPage from './components/ChangePasswordPage';

export default function SettingPage() {
  const { queryParams } = useQueryParams<{ tabActive: string }>();

  const tabs = [
    { value: 'account', label: 'Tài khoản', icon: <UserRoundCog size={64} /> },
    { value: 'change-password', label: 'Đổi mật khẩu', icon: <KeyRoundIcon size={64} /> },
    { value: 'shop', label: 'Cửa hàng', icon: <Store size={64} /> },
  ];

  return (
    <div className="container mx-auto p-6">
      <Tabs
        defaultValue={queryParams.tabActive || 'account'}
        orientation="horizontal"
        className="w-full flex flex-row gap-6"
      >
        <TabsList className="flex flex-col h-full w-72 p-[10px] bg-background border border-border/60">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} className="w-full p-2" value={tab.value}>
              <div className="w-full flex items-start gap-4">
                {tab.icon}
                <span className="text-md font-medium">{tab.label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="account">
          <ProfilePage />
        </TabsContent>
        <TabsContent value="change-password">
          <ChangePasswordPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
