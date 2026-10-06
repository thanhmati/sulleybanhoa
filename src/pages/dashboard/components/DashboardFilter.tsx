import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const MONTH_NAMES = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

interface DashboardFilterProps {
  onChange: (range: { startDate?: string; endDate?: string }) => void;
  value?: { startDate?: string; endDate?: string };
}

const getMonthRange = (date: Dayjs) => ({
  startDate: date.startOf('month').format('YYYY-MM-DD'),
  endDate: date.endOf('month').format('YYYY-MM-DD'),
});

export function DashboardFilter({ onChange, value }: DashboardFilterProps) {
  const [open, setOpen] = useState(false);

  // Khởi tạo theo prop value hoặc mặc định là tháng hiện tại
  const initialDate =
    value?.startDate && dayjs(value.startDate).isValid() ? dayjs(value.startDate) : dayjs();

  const [selectedDate, setSelectedDate] = useState<Dayjs>(initialDate);
  const [viewYear, setViewYear] = useState<number>(initialDate.year());

  useEffect(() => {
    if (value?.startDate) {
      const parsed = dayjs(value.startDate);
      if (
        parsed.isValid() &&
        (!selectedDate.isSame(parsed, 'month') || !selectedDate.isSame(parsed, 'year'))
      ) {
        setSelectedDate(parsed);
        setViewYear(parsed.year());
      }
    }
  }, [value?.startDate]);

  const handleSelectMonth = (monthIndex: number) => {
    const newDate = dayjs().year(viewYear).month(monthIndex).startOf('month');
    setSelectedDate(newDate);
    setOpen(false);
    onChange(getMonthRange(newDate));
  };

  const handlePrevMonth = () => {
    const prev = selectedDate.subtract(1, 'month').startOf('month');
    setSelectedDate(prev);
    setViewYear(prev.year());
    onChange(getMonthRange(prev));
  };

  const handleNextMonth = () => {
    const next = selectedDate.add(1, 'month').startOf('month');
    setSelectedDate(next);
    setViewYear(next.year());
    onChange(getMonthRange(next));
  };

  const handleSelectCurrentMonth = () => {
    const current = dayjs().startOf('month');
    setSelectedDate(current);
    setViewYear(current.year());
    setOpen(false);
    onChange(getMonthRange(current));
  };

  const isCurrentMonth =
    selectedDate.isSame(dayjs(), 'month') && selectedDate.isSame(dayjs(), 'year');

  return (
    <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
      {/* Nút lùi 1 tháng */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 cursor-pointer"
        onClick={handlePrevMonth}
        title="Tháng trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Popover chọn tháng */}
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) {
            setViewYear(selectedDate.year());
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 min-w-[170px] justify-between gap-2 font-medium cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>Tháng {selectedDate.format('MM/YYYY')}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-3" align="end">
          {/* Header chọn năm */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer"
              onClick={() => setViewYear((y) => y - 1)}
              title="Năm trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-sm">Năm {viewYear}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer"
              onClick={() => setViewYear((y) => y + 1)}
              title="Năm sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Grid 12 tháng */}
          <div className="grid grid-cols-3 gap-1.5">
            {MONTH_NAMES.map((monthName, index) => {
              const isSelected = selectedDate.year() === viewYear && selectedDate.month() === index;
              const isThisMonth = dayjs().year() === viewYear && dayjs().month() === index;

              return (
                <Button
                  key={monthName}
                  variant={isSelected ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'h-8 text-xs font-normal cursor-pointer',
                    isSelected && 'font-semibold',
                    isThisMonth &&
                      !isSelected &&
                      'border border-primary/40 font-medium text-primary',
                  )}
                  onClick={() => handleSelectMonth(index)}
                >
                  {monthName}
                </Button>
              );
            })}
          </div>

          {/* Quick jump về tháng hiện tại trong popover */}
          <div className="pt-2 mt-2 border-t flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleSelectCurrentMonth}
            >
              Về tháng hiện tại
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Nút tiến 1 tháng */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 cursor-pointer"
        onClick={handleNextMonth}
        title="Tháng sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Nút về tháng hiện tại hiển thị khi đang xem tháng khác */}
      {!isCurrentMonth && (
        <Button
          variant="secondary"
          size="sm"
          className="h-9 px-2.5 text-xs cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={handleSelectCurrentMonth}
        >
          Tháng này
        </Button>
      )}
    </div>
  );
}
