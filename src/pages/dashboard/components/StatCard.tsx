import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: LucideIcon;
  badgeClassName?: string;
  valueClassName?: string;
  subtext?: string;
  subtextIcon?: LucideIcon;
  subtextClassName?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
  badgeClassName,
  valueClassName,
  subtext,
  subtextIcon: SubIcon,
  subtextClassName,
  onClick,
}: StatCardProps) {
  return (
    <Card
      className="p-5 transition-all hover:shadow-md border-border/80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {Icon ? (
          <div className={`p-2 rounded-lg ${badgeClassName || 'bg-primary/10 text-primary'}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        ) : positive ? (
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <ArrowUpRight className="w-4.5 h-4.5" />
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <ArrowDownRight className="w-4.5 h-4.5" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0 mt-3">
        <p className={`text-2xl font-bold tracking-tight ${valueClassName || 'text-foreground'}`}>
          {value}
        </p>

        {subtext ? (
          <div
            className={`mt-1.5 flex items-center text-xs font-medium ${
              subtextClassName || 'text-muted-foreground'
            }`}
          >
            {SubIcon && <SubIcon className="mr-1.5 h-3.5 w-3.5 shrink-0" />}
            <span>{subtext}</span>
          </div>
        ) : change ? (
          <p
            className={`mt-1.5 text-xs font-medium ${
              positive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {change} so với tháng trước
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
