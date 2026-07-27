import { Table } from '@tanstack/react-table';
import { Order } from '@/types/order';
import { formatCurrency } from '@/lib/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Banknote, Wallet, Receipt, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';

interface OrderSummaryCardsProps {
  table?: Table<Order>;
  orders?: Order[];
  isLoading?: boolean;
}

export function OrderSummaryCards({ table, orders: rawOrders, isLoading }: OrderSummaryCardsProps) {
  const orders = useMemo(() => {
    if (table) {
      return table.getFilteredRowModel().rows.map((row) => row.original);
    }
    return rawOrders || [];
  }, [table, table?.getFilteredRowModel().rows, rawOrders]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalPrice = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const totalDue = orders.reduce((sum, o) => sum + (Number(o.dueAmount) || 0), 0);
    const totalPaid = Math.max(0, totalPrice - totalDue);
    const paidRatio = totalPrice > 0 ? Math.round((totalPaid / totalPrice) * 100) : 0;

    return {
      totalOrders,
      totalPrice,
      totalPaid,
      totalDue,
      paidRatio,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mb-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="py-3 shadow-xs">
            <CardContent className="px-4 py-0 flex items-center justify-between">
              <div className="space-y-1.5 w-full">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mb-5">
      {/* 1. Total Price Card */}
      <Card className="py-3 shadow-xs hover:shadow-sm transition-shadow border-border/80">
        <CardContent className="px-4 py-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tổng giá trị đơn
            </span>
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold tracking-tight text-foreground">
              {formatCurrency(stats.totalPrice)}
            </div>
            <div className="mt-0.5 flex items-center text-[11px] text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span>{stats.totalOrders} đơn hàng</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Paid Card */}
      <Card className="py-3 shadow-xs hover:shadow-sm transition-shadow border-border/80">
        <CardContent className="px-4 py-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Đã thanh toán
            </span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.totalPaid)}
            </div>
            <div className="mt-0.5 flex items-center text-[11px] text-emerald-600/90 dark:text-emerald-400/90">
              <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />
              <span>Đạt {stats.paidRatio}% tổng giá trị</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Due Card */}
      <Card className="py-3 shadow-xs hover:shadow-sm transition-shadow border-border/80">
        <CardContent className="px-4 py-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Số tiền còn nợ
            </span>
            <div
              className={`p-1.5 rounded-md ${
                stats.totalDue > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-1">
            <div
              className={`text-lg font-bold tracking-tight ${
                stats.totalDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
              }`}
            >
              {formatCurrency(stats.totalDue)}
            </div>
            <div className="mt-0.5 flex items-center text-[11px] text-muted-foreground">
              {stats.totalDue > 0 ? (
                <>
                  <AlertCircle className="mr-1 h-3 w-3 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Cần thu hồi từ khách
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />
                  <span>Đã thu hoàn tất 100%</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
