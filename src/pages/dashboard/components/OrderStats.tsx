import { DashboardSummary } from '@/types/dashboard';
import { StatCard } from './StatCard';
import { formatCurrency } from '@/lib/utils/formatters';

interface OrderStatsProps {
  summary: DashboardSummary;
}

export function OrderStats({ summary }: OrderStatsProps) {
  const orderStats = [
    {
      title: 'Tổng đơn hàng',
      value: summary.totalOrders.toLocaleString(),
      change: '+0%',
      positive: true,
    },
    {
      title: 'Doanh thu',
      value: `${formatCurrency(summary.revenue)}`,
      change: '+0%',
      positive: true,
    },
    {
      title: 'Đơn đã giao',
      value: summary.deliveredOrders.toLocaleString(),
      change: '+0%',
      positive: true,
    },
    {
      title: 'Đơn bị huỷ',
      value: summary.cancelledOrders.toLocaleString(),
      change: '-0%',
      positive: false,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {orderStats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
