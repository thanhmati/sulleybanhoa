import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface RevenueChartProps {
  data: {
    week: string;
    revenue: number;
  }[];
}

function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || !payload.length) return null;

  const revenue = payload[0].value as number;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm flex flex-col gap-2">
      <div className="font-medium">📅 {label}</div>
      <div className="text-muted-foreground">
        Doanh thu: <span className="font-semibold text-foreground">{formatCurrency(revenue)}</span>
      </div>
    </div>
  );
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

            <Tooltip content={<CustomTooltip />} />

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
