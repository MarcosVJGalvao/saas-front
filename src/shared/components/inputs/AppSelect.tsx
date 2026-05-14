import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

export interface AppSelectOption {
  label: string;
  value: string | number;
}

interface AppSelectProps extends Omit<TextFieldProps, 'select' | 'children'> {
  options: AppSelectOption[];
}

export const AppSelect = ({ fullWidth = true, options, ...props }: AppSelectProps) => (
  <TextField select fullWidth={fullWidth} {...props}>
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);
