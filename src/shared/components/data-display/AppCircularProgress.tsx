import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';

interface AppCircularProgressProps {
  size?: number;
  fullScreen?: boolean;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

export const AppCircularProgress = ({
  size = 28,
  fullScreen = false,
  ariaLabel = 'Carregando',
  sx,
}: AppCircularProgressProps) => (
  <Stack
    role="status"
    aria-live="polite"
    sx={{
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: fullScreen ? '100vh' : 'auto',
      width: '100%',
      py: 2,
      ...sx,
    }}
  >
    <CircularProgress size={size} aria-label={ariaLabel} />
  </Stack>
);
