import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleSelectDate = (selectedDate?: Date) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    // preserve old time
    if (date) {
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
    }
    setDate(newDate);
    onChange?.(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeParts = e.target.value.split(':');
    const hours = Number(timeParts[0]);
    const minutes = Number(timeParts[1]);
    if (!date) return;
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
    onChange?.(newDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd/MM/yyyy HH:mm') : <span>Chọn ngày giờ</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col space-y-2 p-3 w-auto">
        <Calendar mode="single" selected={date} onSelect={handleSelectDate} initialFocus />
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <input
            type="time"
            className="border rounded-md px-2 py-1 text-sm"
            value={
              date
                ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(
                    2,
                    '0',
                  )}`
                : ''
            }
            onChange={handleTimeChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
