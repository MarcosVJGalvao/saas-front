import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';
import { spacingScale } from '@theme/spacing';
import { responsive } from '@theme/utils/responsive';

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
  compact?: boolean;
  startTextFieldSx?: SxProps<Theme>;
  endTextFieldSx?: SxProps<Theme>;
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
  compact = false,
  startTextFieldSx,
  endTextFieldSx,
}: DateRangePickerProps) => (
  <Stack direction={responsive({ xs: 'column', md: 'row' })} spacing={spacingScale.sm}>
    <AppDatePicker
      label={startLabel}
      value={startValue}
      onChange={onStartChange}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
      textFieldSlotProps={{ size: 'small', sx: startTextFieldSx }}
      {...(compact ? { label: '' } : {})}
    />
    <AppDatePicker
      label={endLabel}
      value={endValue}
      onChange={onEndChange}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
      textFieldSlotProps={{ size: 'small', sx: endTextFieldSx }}
      {...(compact ? { label: '' } : {})}
    />
  </Stack>
);
