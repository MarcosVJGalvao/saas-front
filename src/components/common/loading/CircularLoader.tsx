import type { SxProps, Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

interface CircularLoaderProps {
  size?: number;
  fullScreen?: boolean;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

export const CircularLoader = ({
  size = 28,
  fullScreen = false,
  ariaLabel = 'Carregando',
  sx,
}: CircularLoaderProps) => (
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
