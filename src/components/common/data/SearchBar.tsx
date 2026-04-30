import type { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

interface SearchBarProps {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
}
export const SearchBar = ({ value, onChange, placeholder = 'Buscar...', sx }: SearchBarProps) => (
  <TextField
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    fullWidth
    sx={{ maxWidth: { xs: '100%', sm: 420 }, ...sx }}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      },
    }}
  />
);
