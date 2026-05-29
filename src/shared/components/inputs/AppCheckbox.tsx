import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { ReactNode } from 'react';

interface AppCheckboxProps {
  checked: boolean;
  label: ReactNode;
  disabled?: boolean;
  size?: 'small' | 'medium';
  onChange: (checked: boolean) => void;
}

export const AppCheckbox = ({
  checked,
  label,
  disabled = false,
  size = 'small',
  onChange,
}: AppCheckboxProps) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={checked}
        disabled={disabled}
        size={size}
        onChange={(event) => onChange(event.target.checked)}
      />
    }
    label={label}
  />
);
