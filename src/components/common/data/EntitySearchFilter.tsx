import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

interface EntitySearchFilterProps {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
}

export const EntitySearchFilter = ({
  value,
  onChange,
  placeholder = 'Buscar...',
}: EntitySearchFilterProps) => {
  const theme = useTheme();
  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: theme.palette.background.paper,
          borderRadius: theme.spacing(1.25),
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
