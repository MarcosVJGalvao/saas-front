import type { SxProps, Theme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  sx?: SxProps<Theme>;
}
export const ErrorState = ({
  title = 'Erro ao carregar',
  message,
  retryLabel = 'Tentar novamente',
  onRetry,
  sx,
}: ErrorStateProps) => (
  <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', py: 6, ...sx }}>
    <Typography variant="h5">{title}</Typography>
    <Typography color="text.secondary">{message}</Typography>
    {onRetry !== undefined ? (
      <Button variant="outlined" onClick={onRetry}>
        {retryLabel}
      </Button>
    ) : null}
  </Stack>
);
