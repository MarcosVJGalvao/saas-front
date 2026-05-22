import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export type StatusDotStatus = 'active' | 'inactive' | 'finalized' | 'pending';

interface StatusDotProps {
  status: StatusDotStatus;
  label: string;
}

const STATUS_COLORS: Record<StatusDotStatus, 'success' | 'error' | 'info' | 'warning'> = {
  active: 'success',
  inactive: 'error',
  finalized: 'info',
  pending: 'warning',
};

export const StatusDot = ({ status, label }: StatusDotProps) => {
  const theme = useTheme();
  const colorKey = STATUS_COLORS[status];
  const color = theme.palette[colorKey].main;

  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: color,
          flexShrink: 0,
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
};
