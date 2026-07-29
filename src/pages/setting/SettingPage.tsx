import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRoundCog, KeyRoundIcon } from 'lucide-react';
import { useQueryParams } from '@/hooks/useQueryParams';
import ProfilePage from './components/ProfilePage';
import ChangePasswordPage from './components/ChangePasswordPage';

export default function SettingPage() {
  const { queryParams } = useQueryParams<{ tabActive: string }>();

  const tabs = [
    { value: 'account', label: 'Tài khoản', icon: <UserRoundCog size={16} /> },
    { value: 'change-password', label: 'Đổi mật khẩu', icon: <KeyRoundIcon size={16} /> },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs
        defaultValue={queryParams.tabActive || 'account'}
        className="w-full flex flex-col md:flex-row gap-6"
      >
        <TabsList className="flex flex-row md:flex-col h-auto md:h-full w-full md:w-64 p-1.5 bg-card border border-border rounded-lg shrink-0 justify-start">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full justify-start gap-2.5 px-3 py-2 text-xs font-medium rounded-md text-muted-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1">
          <TabsContent value="account" className="mt-0">
            <ProfilePage />
          </TabsContent>
          <TabsContent value="change-password" className="mt-0">
            <ChangePasswordPage />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
