import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';

interface FormDatePickerProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
}

export const FormDatePicker = <TFieldValues extends FieldValues>({
  name,
  label,
  disabled = false,
  required = false,
}: FormDatePickerProps<TFieldValues>) => {
  const form = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <AppDatePicker
          label={label}
          value={typeof field.value === 'string' ? field.value : null}
          onChange={field.onChange}
          disabled={disabled}
          required={required}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};
