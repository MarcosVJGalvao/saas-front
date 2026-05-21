import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';

interface FormSelectProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  options: AppSelectOption[];
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  fullWidth?: boolean | undefined;
  size?: 'small' | 'medium' | undefined;
}

export const FormSelect = <TFieldValues extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  disabled = false,
  fullWidth = true,
  size = 'medium',
}: FormSelectProps<TFieldValues>) => {
  const form = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <AppSelect
          {...field}
          label={label}
          options={options}
          placeholder={placeholder}
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          value={
            typeof field.value === 'string' || typeof field.value === 'number' ? field.value : ''
          }
        />
      )}
    />
  );
};
