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
import { Input } from '@/components/ui/input';

interface OrderFiltersProps<TData> {
  table: Table<TData>;
}

export function OrderFilters<TData>({ table }: OrderFiltersProps<TData>) {
  const statusColumn = table.getColumn('status');
  const deliveryDateColumn = table.getColumn('deliveryDate');
  const paidColumn = table.getColumn('isPaid');
  const clientNameColumn = table.getColumn('clientName');

  const [status, setStatus] = useState<string>((statusColumn?.getFilterValue() as string) ?? '');
  const [paid, setPaid] = useState<string>((paidColumn?.getFilterValue() as string) ?? '');
  const [clientName, setClientName] = useState<string>(
    (clientNameColumn?.getFilterValue() as string) ?? '',
  );

  const [date, setDate] = useState<Date | undefined>(
    deliveryDateColumn?.getFilterValue()
      ? new Date(deliveryDateColumn.getFilterValue() as string)
      : undefined,
  );

  const { queryParams, setQueryParams, clearQueryParams } = useQueryParams<{
    status: ORDER_STATUS;
    paid: string;
    date: string;
    clientName: string;
  }>();

  useEffect(() => {
    const filters: { id: string; value: any }[] = [];

    if (queryParams.paid) {
      setPaid(queryParams.paid);
      filters.push({ id: 'isPaid', value: queryParams.paid });
    }

    if (queryParams.status) {
      setStatus(queryParams.status);
      filters.push({ id: 'status', value: queryParams.status });
    }

    if (queryParams.date) {
      setDate(new Date(queryParams.date));
      filters.push({ id: 'deliveryDate', value: queryParams.date });
    }

    if (queryParams.clientName) {
      setClientName(queryParams.clientName);
      filters.push({ id: 'clientName', value: queryParams.clientName });
    }

    table.setColumnFilters(filters);
  }, [queryParams.date, queryParams.paid, queryParams.status, queryParams.clientName, table]);

  // --- handlers
  const handleStatusChange = (value: string) => {
    setStatus(value);

    const filterValue = value === 'all' ? undefined : value;
    statusColumn?.setFilterValue(filterValue);
    setQueryParams({ status: filterValue });
  };

  const handleClientNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setClientName(value);
    clientNameColumn?.setFilterValue(value);
    setQueryParams({ clientName: value });
  };

  const handleDateChange = (selectedDate?: Date) => {
    setDate(selectedDate);

    const filterValue = selectedDate ? selectedDate.toISOString() : undefined;
    deliveryDateColumn?.setFilterValue(filterValue);
    setQueryParams({ date: filterValue });
  };

  const handlePaidChange = (value: string) => {
    setPaid(value);

    const filterValue = value === 'all' ? undefined : value;

    paidColumn?.setFilterValue(filterValue ? JSON.parse(filterValue) : '');
    setQueryParams({ paid: filterValue });
  };

  const handleClearFilters = () => {
    setStatus('');
    setDate(undefined);
    setPaid('');
    setClientName('');
    table.resetColumnFilters();
    clearQueryParams();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 flex-row">
      {/* 🔍 Client Name filter */}
      <Input
        placeholder="Tên khách hàng..."
        value={clientName}
        onChange={handleClientNameChange}
        className="w-[200px]"
      />

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

      {(status !== '' || paid !== '' || date || clientName !== '') && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <X className="mr-1 h-4 w-4" /> Xoá lọc
        </Button>
      )}
    </div>
  );
}
