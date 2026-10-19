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
import { X, Flower2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Input } from '@/components/ui/input';
import { useOrdersQuery } from '@/hooks/useOrders';
import { useFlowerTypesQuery } from '@/hooks/useFlowerTypes';
import { calculateFlowerImportPlan } from '@/lib/utils/flowerImport';
import { FlowerImportDialog } from './FlowerImportDialog';
import dayjs from 'dayjs';

interface OrderFiltersProps<TData> {
  table: Table<TData>;
}

export function OrderFilters<TData>({ table }: OrderFiltersProps<TData>) {
  const statusColumn = table.getColumn('status');
  const deliveryDateColumn = table.getColumn('deliveryDate');
  const paidColumn = table.getColumn('isPaid');
  const clientNameColumn = table.getColumn('clientName');
  const preparedColumn = table.getColumn('isPrepared');

  const [status, setStatus] = useState<string>((statusColumn?.getFilterValue() as string) ?? '');
  const [paid, setPaid] = useState<string>((paidColumn?.getFilterValue() as string) ?? '');
  const [prepared, setPrepared] = useState<string>(
    (preparedColumn?.getFilterValue() as string) ?? '',
  );
  const [clientName, setClientName] = useState<string>(
    (clientNameColumn?.getFilterValue() as string) ?? '',
  );

  const [date, setDate] = useState<Date | undefined>(
    deliveryDateColumn?.getFilterValue()
      ? dayjs(deliveryDateColumn.getFilterValue() as string).toDate()
      : undefined,
  );

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { data: allOrders = [] } = useOrdersQuery();
  const { data: flowerTypes = [] } = useFlowerTypesQuery();

  const { queryParams, setQueryParams, clearQueryParams } = useQueryParams<{
    status: ORDER_STATUS;
    paid: string;
    date: string;
    clientName: string;
    prepared: string;
  }>();

  const targetDateStr = date
    ? dayjs(date).format('YYYY-MM-DD')
    : queryParams.date
      ? dayjs(queryParams.date).format('YYYY-MM-DD')
      : dayjs().format('YYYY-MM-DD');

  const importPlan = calculateFlowerImportPlan(allOrders, flowerTypes, targetDateStr);

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
      setDate(dayjs(queryParams.date).toDate());
      filters.push({ id: 'deliveryDate', value: queryParams.date });
    }

    if (queryParams.clientName) {
      setClientName(queryParams.clientName);
      filters.push({ id: 'clientName', value: queryParams.clientName });
    }

    if (queryParams.prepared) {
      setPrepared(queryParams.prepared);
      filters.push({ id: 'isPrepared', value: queryParams.prepared });
    }

    table.setColumnFilters(filters);
  }, [
    queryParams.date,
    queryParams.paid,
    queryParams.status,
    queryParams.clientName,
    queryParams.prepared,
    table,
  ]);

  // --- handlers
  const handleStatusChange = (value: string) => {
    setStatus(value);

    const filterValue = value === 'all' ? undefined : value;
    statusColumn?.setFilterValue(filterValue);
    setQueryParams({ status: filterValue });
  };

  const handlePreparedChange = (value: string) => {
    setPrepared(value);

    const filterValue = value === 'all' ? undefined : value;
    preparedColumn?.setFilterValue(filterValue);
    setQueryParams({ prepared: filterValue });
  };

  const handleClientNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setClientName(value);
    clientNameColumn?.setFilterValue(value);
    setQueryParams({ clientName: value });
  };

  const handleDateChange = (selectedDate?: Date) => {
    setDate(selectedDate);

    const filterValue = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : undefined;
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
    setPrepared('');
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

      {/* 🌸 Preparation filter (Thợ cắm hoa) */}
      <Select value={prepared} onValueChange={handlePreparedChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Tiến độ cắm hoa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả tiến độ</SelectItem>
          <SelectItem value="false">Chưa chuẩn bị</SelectItem>
          <SelectItem value="true">Đã cắm xong</SelectItem>
        </SelectContent>
      </Select>

      <DatePicker value={date} onChange={handleDateChange} />

      {/* 🌸 Nút xem hoa cần nhập theo ngày lọc */}
      <Button
        type="button"
        variant={date ? 'default' : 'outline'}
        size="sm"
        onClick={() => setIsImportDialogOpen(true)}
        className="gap-2 cursor-pointer h-9 px-3 shrink-0"
        title={
          date
            ? `Xem danh sách hoa cần nhập cho ngày ${dayjs(date).format('DD/MM/YYYY')}`
            : 'Xem danh sách hoa cần nhập hôm nay'
        }
      >
        <Flower2 className="h-4 w-4" />
        <span>Hoa cần nhập</span>
        {importPlan.totalFlowerTypes > 0 && (
          <span
            className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              date
                ? 'bg-primary-foreground/25 text-primary-foreground'
                : 'bg-primary/20 text-primary-dark'
            }`}
          >
            {importPlan.totalFlowerTypes} loại
          </span>
        )}
      </Button>

      {(status !== '' || paid !== '' || prepared !== '' || date || clientName !== '') && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <X className="mr-1 h-4 w-4" /> Xoá lọc
        </Button>
      )}

      {/* Modal danh sách hoa cần nhập */}
      <FlowerImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        orders={allOrders}
        flowerTypes={flowerTypes}
        initialDate={targetDateStr}
      />
    </div>
  );
}
