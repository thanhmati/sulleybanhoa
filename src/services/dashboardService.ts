import api from '@/lib/axios';
import { DashboardSummary } from '@/types/dashboard';

export const dashboardService = {
  getDashboardSummary: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardSummary> => {
    const res = await api.get('/dashboard/summary', { params });
    return res.data;
  },
};
