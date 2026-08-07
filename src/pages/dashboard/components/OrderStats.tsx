import { DashboardSummary } from '@/types/dashboard';
import { StatCard } from './StatCard';
import { formatCurrency } from '@/lib/utils/formatters';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Banknote,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

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

  const totalOrdersValue = summary.totalOrders;
  const totalPaid = summary.totalPaid ?? 0;
  const totalDue = summary.totalDue ?? 0;
  const totalPriceSum = totalPaid + totalDue;
  const paidRatio = totalPriceSum > 0 ? Math.round((totalPaid / totalPriceSum) * 100) : 0;

  const orderStats = [
    {
      title: 'Tổng đơn hàng',
      value: totalOrdersValue.toLocaleString(),
      change: totalOrdersChange.changeText,
      positive: totalOrdersChange.positive,
      icon: ShoppingBag,
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(summary.revenue),
      change: revenueChange.changeText,
      positive: revenueChange.positive,
      icon: Banknote,
    },
    {
      title: 'Lợi nhuận',
      value: formatCurrency(summary.totalProfit),
      change: profitChange.changeText,
      positive: profitChange.positive,
      icon: TrendingUp,
    },
    {
      title: 'Đã thanh toán',
      value: formatCurrency(totalPaid),
      icon: Wallet,
      badgeClassName: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      valueClassName: 'text-emerald-600 dark:text-emerald-400',
      subtext: `Đạt ${paidRatio}% tổng giá trị`,
      subtextIcon: CheckCircle2,
      subtextClassName: 'text-emerald-600/90 dark:text-emerald-400/90',
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Số tiền cần thu hồi',
      value: formatCurrency(totalDue),
      icon: Receipt,
      badgeClassName:
        totalDue > 0
          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
          : 'bg-muted text-muted-foreground',
      valueClassName: totalDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground',
      subtext: totalDue > 0 ? 'Cần thu hồi từ khách' : 'Đã thu hoàn tất 100%',
      subtextIcon: totalDue > 0 ? AlertCircle : CheckCircle2,
      subtextClassName: totalDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600',
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Chi phí',
      value: formatCurrency(summary.totalExpense),
      change: expenseChange.changeText,
      positive: !expenseChange.positive, // expense decrease is positive
      icon: CreditCard,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {orderStats.map((stat) => (
        <StatCard onClick={stat.onClick} key={stat.title} {...stat} />
      ))}
    </div>
  );
}
