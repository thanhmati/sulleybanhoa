import { DashboardSummary } from '@/types/dashboard';
import { StatCard } from './StatCard';
import { formatCurrency } from '@/lib/utils/formatters';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const prev = summary.previous;

  const totalOrdersChange = calculateChange(summary.totalOrders, prev?.totalOrders ?? 0);
  const revenueChange = calculateChange(summary.revenue, prev?.revenue ?? 0);
  const expenseChange = calculateChange(summary.totalExpense, prev?.totalExpense ?? 0);
  const profitChange = calculateChange(summary.totalProfit, prev?.totalProfit ?? 0);

  const orderStats = [
    {
      title: 'Tổng đơn hàng',
      value: summary.totalOrders.toLocaleString(),
      change: totalOrdersChange.changeText,
      positive: totalOrdersChange.positive,
      onClick: () => navigate('/orders'),
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(summary.revenue),
      change: revenueChange.changeText,
      positive: revenueChange.positive,
    },
    {
      title: 'Chi phí',
      value: summary.totalExpense.toLocaleString(),
      change: expenseChange.changeText,
      positive: expenseChange.positive,
    },
    {
      title: 'Lợi nhuận',
      value: summary.totalProfit.toLocaleString(),
      change: profitChange.changeText,
      positive: profitChange.positive,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {orderStats.map((stat) => (
        <StatCard onClick={stat.onClick} key={stat.title} {...stat} />
      ))}
    </div>
  );
}
