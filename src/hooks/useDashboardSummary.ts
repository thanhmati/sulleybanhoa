import { dashboardService } from '@/services/dashboardService';
import { useQuery } from '@tanstack/react-query';

export const useDashboardSummary = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['dashboard-summary', params],
    queryFn: () => dashboardService.getDashboardSummary(params),
  });
};
