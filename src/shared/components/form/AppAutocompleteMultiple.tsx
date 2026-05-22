import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import type { AppAutocompleteOption } from '@shared/components/form/AppAutocomplete';

interface AppAutocompleteMultipleProps {
  label: string;
  options: AppAutocompleteOption[];
  value: AppAutocompleteOption[];
  onChange: (value: AppAutocompleteOption[]) => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const AppAutocompleteMultiple = ({
  label,
  options,
  value,
  onChange,
  helperText,
  error = false,
  disabled = false,
  placeholder,
}: AppAutocompleteMultipleProps) => (
  <Autocomplete
    multiple
    options={options}
    value={value}
    onChange={(_, nextValue) => onChange(nextValue)}
    getOptionLabel={(option) => option.label}
    isOptionEqualToValue={(option, selected) => option.value === selected.value}
    disabled={disabled}
    sx={{ width: '100%' }}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        error={error}
        helperText={helperText}
        placeholder={value.length === 0 ? placeholder : undefined}
      />
    )}
  />
);
