import { StatCard } from './StatCard';

const orderStats = [
  { title: 'Tổng đơn hàng', value: '1,240', change: '+8%', positive: true },
  { title: 'Doanh thu tháng này', value: '₫120,000,000', change: '+12%', positive: true },
  { title: 'Đơn đã giao', value: '870', change: '+5%', positive: true },
  { title: 'Đơn bị huỷ', value: '45', change: '-2%', positive: false },
];

export function OrderStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {orderStats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
