import { Table } from '@tanstack/react-table';
import { ORDER_STATUS, ORDER_STATUS_LABEL } from '@/lib/constants/order.constant';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { useQueryParams } from '@/hooks/useQueryParams';

interface OrderFiltersProps<TData> {
  table: Table<TData>;
}

export function OrderFilters<TData>({ table }: OrderFiltersProps<TData>) {
  const statusColumn = table.getColumn('status');
  const deliveryDateColumn = table.getColumn('deliveryDate');
  const paidColumn = table.getColumn('isPaid');

  const [status, setStatus] = useState<string>((statusColumn?.getFilterValue() as string) ?? '');
  const [paid, setPaid] = useState<string>((paidColumn?.getFilterValue() as string) ?? '');

  const [date, setDate] = useState<Date | undefined>(
    deliveryDateColumn?.getFilterValue()
      ? new Date(deliveryDateColumn.getFilterValue() as string)
      : undefined,
  );

  const { queryParams } = useQueryParams<{ status: ORDER_STATUS }>();

  useEffect(() => {
    if (queryParams.status) {
      setStatus(queryParams.status);
      statusColumn?.setFilterValue(queryParams.status);
    }
  }, [queryParams.status, statusColumn]);

  // --- handlers
  const handleStatusChange = (value: string) => {
    setStatus(value);
    statusColumn?.setFilterValue(value === 'all' ? undefined : value);
  };

  const handleDateChange = (selectedDate?: Date) => {
    setDate(selectedDate);
    deliveryDateColumn?.setFilterValue(
      selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
    );
  };

  const handlePaidChange = (value: string) => {
    setPaid(value);

    if (value === 'all') {
      paidColumn?.setFilterValue(undefined);
    } else {
      paidColumn?.setFilterValue(value === 'true');
    }
  };

  const handleClearFilters = () => {
    setStatus('');
    setDate(undefined);
    setPaid('');
    table.resetColumnFilters();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 flex-row">
      {/* 🏷 Status filter */}
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          {Object.values(ORDER_STATUS).map((status) => (
            <SelectItem key={status} value={status}>
              {ORDER_STATUS_LABEL[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 💰 Paid filter */}
      <Select value={paid} onValueChange={handlePaidChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Thanh toán" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="true">Đã thanh toán</SelectItem>
          <SelectItem value="false">Chưa thanh toán</SelectItem>
        </SelectContent>
      </Select>

      <DatePicker value={date} onChange={handleDateChange} />

      {(status !== 'all' || paid !== 'all' || date) && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <X className="mr-1 h-4 w-4" /> Xoá lọc
        </Button>
      )}
    </div>
  );
}
