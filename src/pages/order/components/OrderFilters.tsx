'use client';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

interface OrderFiltersProps<TData> {
  table: Table<TData>;
}

export function OrderFilters<TData>({ table }: OrderFiltersProps<TData>) {
  const statusColumn = table.getColumn('status');
  const deliveryTimeColumn = table.getColumn('deliveryTime');

  // ✅ Local state để đồng bộ UI
  const [status, setStatus] = useState<string>((statusColumn?.getFilterValue() as string) ?? 'all');

  const [date, setDate] = useState<Date | undefined>(
    deliveryTimeColumn?.getFilterValue()
      ? new Date(deliveryTimeColumn.getFilterValue() as string)
      : undefined,
  );

  // --- handlers
  const handleStatusChange = (value: string) => {
    setStatus(value);
    statusColumn?.setFilterValue(value === 'all' ? undefined : value);
  };

  const handleDateChange = (selectedDate?: Date) => {
    setDate(selectedDate);
    deliveryTimeColumn?.setFilterValue(
      selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
    );
  };

  const handleClearFilters = () => {
    setStatus('all');
    setDate(undefined);
    statusColumn?.setFilterValue(undefined);
    deliveryTimeColumn?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'dd/MM/yyyy', { locale: vi }) : 'Ngày giao'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
        </PopoverContent>
      </Popover>

      {/* ❌ Clear filters */}
      {(status !== 'all' || date) && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <X className="mr-1 h-4 w-4" /> Xoá lọc
        </Button>
      )}
    </div>
  );
}
