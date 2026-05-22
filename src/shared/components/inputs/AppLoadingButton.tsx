import CircularProgress from '@mui/material/CircularProgress';
import type { ButtonProps } from '@mui/material/Button';
import { AppButton } from '@shared/components/inputs/AppButton';

export type AppLoadingButtonProps = ButtonProps & { loading?: boolean };

export const AppLoadingButton = ({
  loading = false,
  disabled,
  children,
  startIcon,
  ...props
}: AppLoadingButtonProps) => (
  <AppButton
    disabled={disabled ?? loading}
    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
    {...props}
  >
    {children}
  </AppButton>
);
