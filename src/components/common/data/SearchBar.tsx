import type { SxProps, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useDebouncedCallback } from '../../../hooks/useDebounce/useDebouncedCallback';
import { commonDataMessages } from '../messages';

interface SearchBarProps {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  debounceInMilliseconds?: number;
  sx?: SxProps<Theme>;
}
export const SearchBar = ({
  value,
  onChange,
  placeholder = commonDataMessages.searchPlaceholder,
  debounceInMilliseconds = 0,
  sx,
}: SearchBarProps) => {
  const handleDebouncedChange = useDebouncedCallback(onChange, debounceInMilliseconds);

  return (
    <TextField
      value={value}
      onChange={(event) => handleDebouncedChange(event.target.value)}
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
};
