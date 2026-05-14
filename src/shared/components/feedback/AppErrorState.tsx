import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { AppButton } from '@shared/components/inputs/AppButton';

interface AppErrorStateProps {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  sx?: SxProps<Theme>;
}

export const AppErrorState = ({
  title = 'Erro ao carregar',
  message,
  retryLabel = 'Tentar novamente',
  onRetry,
  sx,
}: AppErrorStateProps) => (
  <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', py: 6, ...sx }}>
    <Typography variant="h5">{title}</Typography>
    <Typography color="text.secondary">{message}</Typography>
    {onRetry !== undefined ? (
      <AppButton variant="outlined" onClick={onRetry}>
        {retryLabel}
      </AppButton>
    ) : null}
  </Stack>
);
