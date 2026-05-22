import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { SxProps, Theme } from '@mui/material/styles';
import { useState } from 'react';

export interface AppDatePickerProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  helperText?: string | undefined;
  error?: boolean | undefined;
  fullWidth?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  textFieldSlotProps?:
    | {
        size?: 'small' | 'medium' | undefined;
        sx?: SxProps<Theme> | undefined;
      }
    | undefined;
}

const DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';
const BACKEND_DATE_FORMAT = 'yyyy-MM-dd';
const COMPACT_BACKEND_DATE_FORMAT = 'yyyyMMdd';
const DIGIT_DATE_FORMAT = 'ddMMyyyy';

const toBackendDate = (date: Date | null): string | null => {
  if (date === null) {
    return null;
  }

  if (!isValid(date)) {
    return null;
  }

  return format(date, BACKEND_DATE_FORMAT);
};

const toDateObject = (value: string | null): Date | null => {
  if (value === null || value.length === 0) {
    return null;
  }

  const formats = [
    BACKEND_DATE_FORMAT,
    DISPLAY_DATE_FORMAT,
    COMPACT_BACKEND_DATE_FORMAT,
    DIGIT_DATE_FORMAT,
  ];

  for (const currentFormat of formats) {
    const parsedDate = parse(value, currentFormat, new Date());

    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return null;
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
  const [draftState, setDraftState] = useState<{
    sourceValue: string | null;
    pickerValue: Date | null;
  }>({
    sourceValue: value,
    pickerValue: parsedValue,
  });
  const pickerValue = draftState.sourceValue === value ? draftState.pickerValue : parsedValue;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <DatePicker
        label={label}
        value={pickerValue}
        disabled={disabled}
        keepOpenDuringFieldFocus
        {...(minDate !== undefined ? { minDate } : {})}
        {...(maxDate !== undefined ? { maxDate } : {})}
        onChange={(nextValue, context) => {
          setDraftState({
            sourceValue: value,
            pickerValue: nextValue,
          });

          if (context.validationError !== null) {
            return;
          }

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
