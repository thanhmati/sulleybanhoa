import { ORDER_STATUS } from '@/lib/constants/order.constant';

export interface StatusDistribution {
  status: ORDER_STATUS;
  count: number;
}

export interface WeeklyRevenue {
  week: string;
  revenue: number;
}

export interface DashboardSummary {
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  returnedOrders: number;
  revenue: number;
  weeklyRevenue: WeeklyRevenue[];
  statusDistribution: StatusDistribution[];
}
