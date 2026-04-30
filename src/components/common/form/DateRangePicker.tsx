import Stack from '@mui/material/Stack';
import { AppDatePicker } from '../date/AppDatePicker';
import { spacingScale } from '../../../theme/spacing';

interface DateRangePickerProps {
  startLabel?: string;
  endLabel?: string;
  startValue: string | null;
  endValue: string | null;
  onStartChange: (value: string | null) => void;
  onEndChange: (value: string | null) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const DateRangePicker = ({
  startLabel = 'Data inicial',
  endLabel = 'Data final',
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  disabled = false,
  minDate,
  maxDate,
}: DateRangePickerProps) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={spacingScale.sm}>
    <AppDatePicker
      label={startLabel}
      value={startValue}
      onChange={onStartChange}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
    />
    <AppDatePicker
      label={endLabel}
      value={endValue}
      onChange={onEndChange}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
    />
  </Stack>
);
