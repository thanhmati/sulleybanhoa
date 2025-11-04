import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value?: string | Date;
  onChange?: (value: Date | undefined) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Chuyển sang Date object
  const date = React.useMemo(() => {
    if (!value) return undefined;
    return new Date(value);
  }, [value]);

  const [hours, setHours] = React.useState(date ? date.getHours() : 0);
  const [minutes, setMinutes] = React.useState(date ? date.getMinutes() : 0);

  const handleChange = (h: number, m: number) => {
    setHours(h);
    setMinutes(m);
    const newDate = new Date();
    newDate.setHours(h);
    newDate.setMinutes(m);
    onChange?.(newDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between">
          <span>
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
          </span>
          <Clock className="h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 flex gap-2 items-center">
        <div className="flex flex-col items-center">
          <label className="text-xs text-muted-foreground">Giờ</label>
          <input
            type="number"
            min={0}
            max={23}
            value={hours}
            onChange={(e) => handleChange(+e.target.value, minutes)}
            className="w-16 text-center border rounded-md py-1"
          />
        </div>
        <div className="text-lg">:</div>
        <div className="flex flex-col items-center">
          <label className="text-xs text-muted-foreground">Phút</label>
          <input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => handleChange(hours, +e.target.value)}
            className="w-16 text-center border rounded-md py-1"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
