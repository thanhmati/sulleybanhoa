import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { vi as viLocale } from 'react-day-picker/locale';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleSelectDate = (selectedDate?: Date) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    setDate(newDate);
    onChange?.(newDate);
  };

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd/MM/yyyy', { locale: vi }) : <span>Chọn ngày</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col space-y-2 p-3 w-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelectDate}
          initialFocus
          locale={viLocale}
        />
      </PopoverContent>
    </Popover>
  );
}
