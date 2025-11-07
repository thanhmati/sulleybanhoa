import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { vi as viLocale } from 'react-day-picker/locale';

interface DashboardFilterProps {
  onChange: (range: { startDate?: string; endDate?: string }) => void;
}

export function DashboardFilter({ onChange }: DashboardFilterProps) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: dayjs().startOf('month').toDate(),
    to: dayjs().endOf('month').toDate(),
  });

  const handleApply = () => {
    if (range?.from && range?.to) {
      onChange({
        startDate: dayjs(range.from).format('YYYY-MM-DD'),
        endDate: dayjs(range.to).format('YYYY-MM-DD'),
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            {range?.from && range?.to
              ? `${dayjs(range.from).format('DD/MM/YYYY')} → ${dayjs(range.to).format('DD/MM/YYYY')}`
              : 'Chọn khoảng thời gian'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            locale={viLocale}
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" onClick={handleApply}>
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
