import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export interface SelectFilterOption {
  value: string;
  label: string;
}

interface SelectFilterFieldProps {
  label: string;
  value: string;
  options: ReadonlyArray<SelectFilterOption>;
  allLabel?: string;
  onChange: (value: string) => void;
}

export const SelectFilterField = ({
  label,
  value,
  options,
  allLabel = 'Todos',
  onChange,
}: SelectFilterFieldProps) => (
  <TextField
    select
    label={label}
    value={value}
    onChange={(event) => onChange(String(event.target.value))}
    fullWidth
  >
    <MenuItem value="">{allLabel}</MenuItem>
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);
