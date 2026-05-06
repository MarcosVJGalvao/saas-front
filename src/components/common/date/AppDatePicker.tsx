import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { SxProps, Theme } from '@mui/material/styles';

export interface AppDatePickerProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  textFieldSlotProps?: {
    size?: 'small' | 'medium';
    sx?: SxProps<Theme>;
  };
}

const DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';
const BACKEND_DATE_FORMAT = 'yyyy-MM-dd';

const toBackendDate = (date: Date | null): string | null => {
  if (date === null) {
    return null;
  }
  return format(date, BACKEND_DATE_FORMAT);
};

const toDateObject = (value: string | null): Date | null => {
  if (value === null || value.length === 0) {
    return null;
  }
  return parse(value, BACKEND_DATE_FORMAT, new Date());
};

export const AppDatePicker = ({
  label,
  value,
  onChange,
  helperText,
  error = false,
  fullWidth = true,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  textFieldSlotProps,
}: AppDatePickerProps) => {
  const parsedValue = toDateObject(value);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <DatePicker
        label={label}
        value={parsedValue}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        onChange={(nextValue) => {
          onChange(toBackendDate(nextValue));
        }}
        format={DISPLAY_DATE_FORMAT}
        slotProps={{
          textField: {
            ...textFieldSlotProps,
            fullWidth,
            required,
            error,
            helperText,
          },
        }}
      />
    </LocalizationProvider>
  );
};
