import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';

interface FormTextFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export const FormTextField = <TFieldValues extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  disabled = false,
  fullWidth = true,
  size = 'medium',
}: FormTextFieldProps<TFieldValues>) => {
  const form = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};
