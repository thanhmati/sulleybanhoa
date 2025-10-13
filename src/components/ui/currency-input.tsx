import { NumericFormat } from 'react-number-format';
import { Input } from '@/components/ui/input';

interface CurrencyInputProps {
  value?: number | null;
  onChange?: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder, disabled }: CurrencyInputProps) {
  return (
    <NumericFormat
      value={value ?? ''}
      thousandSeparator=","
      suffix=" ₫"
      allowNegative={false}
      customInput={Input}
      placeholder={placeholder}
      disabled={disabled}
      onValueChange={(vals) => onChange?.(vals.floatValue || 0)}
    />
  );
}
