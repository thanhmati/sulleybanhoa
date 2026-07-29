import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeSettingService } from '@/services/storeSettingService';
import { toast } from 'sonner';

export const STORE_SETTING_QUERY_KEYS = {
  all: ['store_settings'] as const,
  key: (key: string) => ['store_settings', key] as const,
};

export function useStoreSettingsQuery() {
  return useQuery({
    queryKey: STORE_SETTING_QUERY_KEYS.all,
    queryFn: () => storeSettingService.getSettings(),
  });
}

export function useStoreSettingByKeyQuery<T = any>(key: string, fallbackDefault: T) {
  return useQuery({
    queryKey: STORE_SETTING_QUERY_KEYS.key(key),
    queryFn: () => storeSettingService.getSettingByKey<T>(key, fallbackDefault),
  });
}

export function useUpdateStoreSettingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      storeSettingService.updateSetting(key, value),
    onSuccess: () => {
      toast.success('Cập nhật cấu hình thành công!');
      queryClient.invalidateQueries({ queryKey: STORE_SETTING_QUERY_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Không thể cập nhật cấu hình');
    },
  });
}
