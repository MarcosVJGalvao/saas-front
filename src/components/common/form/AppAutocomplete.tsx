import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export interface AppAutocompleteOption {
  label: string;
  value: string;
}

interface AppAutocompleteProps {
  label: string;
  options: AppAutocompleteOption[];
  value: AppAutocompleteOption | null;
  onChange: (value: AppAutocompleteOption | null) => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}

export const AppAutocomplete = ({
  label,
  options,
  value,
  onChange,
  helperText,
  error = false,
  disabled = false,
}: AppAutocompleteProps) => (
  <Autocomplete
    options={options}
    value={value}
    onChange={(_, nextValue) => onChange(nextValue)}
    getOptionLabel={(option) => option.label}
    isOptionEqualToValue={(option, selected) => option.value === selected.value}
    disabled={disabled}
    sx={{ width: '100%' }}
    renderInput={(params) => (
      <TextField {...params} label={label} error={error} helperText={helperText} />
    )}
  />
);
