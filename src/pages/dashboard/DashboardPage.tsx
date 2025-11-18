import { useState } from 'react';
import { OrderStats } from './components/OrderStats';
import { OrderStatusPieChart } from './components/OrderStatusPieChart';
import { RevenueChart } from './components/RevenueChart';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import { DashboardFilter } from './components/DashboardFilter';

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6 p-6">{children}</div>;
}

export default function DashboardPage() {
  const [params, setParams] = useState<{
    startDate?: string;
    endDate?: string;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const { data, isLoading } = useDashboardSummary(params);

  if (isLoading)
    return (
      <Wrapper>
        <div>Đang tải dữ liệu...</div>
      </Wrapper>
    );
  if (!data)
    return (
      <Wrapper>
        <div>Không có dữ liệu thống kê</div>
      </Wrapper>
    );

  return (
    <Wrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bảng điều khiển</h2>
          <p className="text-muted-foreground">Theo dõi hiệu suất đơn hàng và doanh thu</p>
        </div>
        <DashboardFilter onChange={setParams} />
      </div>

      {/* Section 1: Stats */}
      <OrderStats summary={data} />

      {/* Section 2: Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={data.weeklyRevenue} />
        <OrderStatusPieChart data={data.statusDistribution} />
      </div>
    </Wrapper>
  );
}
