import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ORDER_STATUS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABEL,
} from '@/lib/constants/order.constant';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface OrderStatusPieChartProps {
  data: {
    status: ORDER_STATUS;
    count: number;
  }[];
}

export function OrderStatusPieChart({ data }: OrderStatusPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: ORDER_STATUS_LABEL[item.status],
      value: item.count,
      percentage: total ? ((item.count / total) * 100).toFixed(1) : 0,
      color: ORDER_STATUS_COLORS[item.status] || '#94a3b8',
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tỷ lệ trạng thái đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, _name, entry: any) =>
                `${entry.payload.percentage}% (${value} đơn)`
              }
              labelFormatter={() => ''}
            />
            <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
