import { supabase } from '@/lib/supabase';
import { DashboardSummary } from '@/types/dashboard';

export const dashboardService = {
  getDashboardSummary: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardSummary> => {
    const { data, error } = await supabase.rpc('get_dashboard_summary', {
      start_date: params?.startDate || null,
      end_date: params?.endDate || null,
    });

    if (error) throw error;

    return {
      totalOrders: data.totalOrders || 0,
      totalExpense: Number(data.totalExpense || 0),
      totalProfit: Number(data.totalProfit || 0),
      revenue: Number(data.revenue || 0),
      weeklyRevenue: (data.weeklyRevenue || []).map((wr: any) => ({
        week: wr.week,
        revenue: Number(wr.revenue || 0),
      })),
      statusDistribution: (data.statusDistribution || []).map((sd: any) => ({
        status: sd.status,
        count: Number(sd.count || 0),
      })),
    };
  },
};
