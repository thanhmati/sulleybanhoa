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
import { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface OrderFiltersProps<TData> {
  table: Table<TData>;
}

export function OrderFilters<TData>({ table }: OrderFiltersProps<TData>) {
  const statusColumn = table.getColumn('status');
  const deliveryDateColumn = table.getColumn('deliveryDate');

  // ✅ Local state để đồng bộ UI
  const [status, setStatus] = useState<string>((statusColumn?.getFilterValue() as string) ?? 'all');

  const [date, setDate] = useState<Date | undefined>(
    deliveryDateColumn?.getFilterValue()
      ? new Date(deliveryDateColumn.getFilterValue() as string)
      : undefined,
  );

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

  const handleClearFilters = () => {
    setStatus('all');
    statusColumn?.setFilterValue(undefined);
    handleDateChange(undefined);
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

      {/* 📅 Delivery date filter */}
      <DatePicker value={date} onChange={handleDateChange} />

      {/* ❌ Clear filters */}
      {(status !== 'all' || date) && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <X className="mr-1 h-4 w-4" /> Xoá lọc
        </Button>
      )}
    </div>
  );
}
