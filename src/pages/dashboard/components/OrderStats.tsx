import { DashboardSummary } from '@/types/dashboard';
import { StatCard } from './StatCard';
import { formatCurrency } from '@/lib/utils/formatters';

interface OrderStatsProps {
  summary: DashboardSummary;
}

function calculateChange(current: number, previous: number) {
  if (!previous || previous === 0) {
    return { changeText: '–', positive: true };
  }

  const diff = ((current - previous) / previous) * 100;
  const rounded = diff.toFixed(1);
  const positive = diff >= 0;

  return {
    changeText: `${positive ? '+' : ''}${rounded}%`,
    positive,
  };
}

export function OrderStats({ summary }: OrderStatsProps) {
  const prev = summary.previous;

  const totalOrdersChange = calculateChange(summary.totalOrders, prev?.totalOrders ?? 0);
  const revenueChange = calculateChange(summary.revenue, prev?.revenue ?? 0);
  const deliveredChange = calculateChange(summary.deliveredOrders, prev?.deliveredOrders ?? 0);
  const cancelledChange = calculateChange(summary.cancelledOrders, prev?.cancelledOrders ?? 0);

  const orderStats = [
    {
      title: 'Tổng đơn hàng',
      value: summary.totalOrders.toLocaleString(),
      change: totalOrdersChange.changeText,
      positive: totalOrdersChange.positive,
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(summary.revenue),
      change: revenueChange.changeText,
      positive: revenueChange.positive,
    },
    {
      title: 'Đơn đã giao',
      value: summary.deliveredOrders.toLocaleString(),
      change: deliveredChange.changeText,
      positive: deliveredChange.positive,
    },
    {
      title: 'Đơn bị huỷ',
      value: summary.cancelledOrders.toLocaleString(),
      change: cancelledChange.changeText,
      positive: cancelledChange.positive,
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
