import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
import { AppButton } from '@shared/components/inputs/AppButton';

const i18n = sharedComponentsI18n.errorState;

interface AppErrorStateProps {
  title?: string | undefined;
  message: string;
  retryLabel?: string | undefined;
  onRetry?: (() => void) | undefined;
  sx?: SxProps<Theme> | undefined;
}

export const AppErrorState = ({
  title = i18n.title,
  message,
  retryLabel = i18n.retryLabel,
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
