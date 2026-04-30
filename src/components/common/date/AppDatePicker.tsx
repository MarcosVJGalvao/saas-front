import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface AppDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  required?: boolean;
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
  format = DISPLAY_DATE_FORMAT,
  ...rest
}: AppDatePickerProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
    <DatePicker
      label={label}
      value={toDateObject(value)}
      onChange={(nextValue) => {
        onChange(toBackendDate(nextValue));
      }}
      format={format}
      slotProps={{
        textField: {
          fullWidth,
          required,
          error,
          helperText,
        },
      }}
      {...rest}
    />
  </LocalizationProvider>
);
