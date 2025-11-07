import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface RevenueChartProps {
  data: {
    week: string;
    revenue: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo tuần</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v: number) => `${v.toLocaleString()} ₫`}
              labelFormatter={(label) => `📅 ${label}`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
