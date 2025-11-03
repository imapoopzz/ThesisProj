import { Calendar } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface DatePickerProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({ date, setDate, placeholder = "Pick a date" }: DatePickerProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setDate?.(new Date(value));
    } else {
      setDate?.(undefined);
    }
  };

  const formatDateValue = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="relative">
      <Input
        type="date"
        value={formatDateValue(date)}
        onChange={handleDateChange}
        placeholder={placeholder}
        className="pl-10"
      />
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}