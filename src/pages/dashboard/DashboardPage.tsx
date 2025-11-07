import { OrderStats } from './components/OrderStats';
import { OrderStatusPieChart } from './components/OrderStatusPieChart';
import { RevenueChart } from './components/RevenueChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bảng điều khiển</h2>
        <p className="text-muted-foreground">Theo dõi hiệu suất đơn hàng và doanh thu</p>
      </div>

      {/* Section 1: Stats */}
      <OrderStats />

      {/* Section 2: Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart />
        <OrderStatusPieChart />
      </div>
    </div>
  );
}
