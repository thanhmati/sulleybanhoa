import { supabase } from '@/lib/supabase';
import { DashboardSummary } from '@/types/dashboard';
import dayjs from 'dayjs';

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

    let totalDue = Number(data.totalDue ?? 0);
    let totalPaid = Number(data.totalPaid ?? 0);

    if (data.totalDue === undefined || data.totalPaid === undefined) {
      const startDate = params?.startDate || dayjs().startOf('month').format('YYYY-MM-DD');
      const endDate = params?.endDate || dayjs().endOf('month').format('YYYY-MM-DD');

      const { data: orderData } = await supabase
        .from('orders')
        .select('price, due_amount')
        .neq('status', 'CANCELLED')
        .gte('delivery_date', startDate)
        .lte('delivery_date', endDate);

      if (orderData) {
        const sumPrice = orderData.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
        const sumDue = orderData.reduce((sum, o) => sum + (Number(o.due_amount) || 0), 0);
        totalDue = sumDue;
        totalPaid = Math.max(0, sumPrice - sumDue);
      }
    }

    return {
      totalOrders: data.totalOrders || 0,
      totalExpense: Number(data.totalExpense || 0),
      totalProfit: Number(data.totalProfit || 0),
      revenue: Number(data.revenue || 0),
      totalPaid,
      totalDue,
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
