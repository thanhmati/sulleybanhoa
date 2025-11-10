import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  onClick?: () => void;
}

export function StatCard({ title, value, change, positive, onClick }: StatCardProps) {
  return (
    <Card className="p-4" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <CardHeader className="flex justify-between items-center p-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {positive ? (
          <ArrowUpRight className="text-green-500 w-4 h-4" />
        ) : (
          <ArrowDownRight className="text-red-500 w-4 h-4" />
        )}
      </CardHeader>
      <CardContent className="p-0 mt-2">
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {change} so với tháng trước
        </p>
      </CardContent>
    </Card>
  );
}
