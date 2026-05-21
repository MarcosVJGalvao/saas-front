import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';

interface AppSnackbarProps {
  open: boolean;
  message?: string | undefined;
  children?: ReactNode | undefined;
  severity?: SnackbarSeverity | undefined;
  autoHideDuration?: number | null | undefined;
  onClose: () => void;
  onExited?: (() => void) | undefined;
  anchorOrigin?:
    | { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' }
    | undefined;
  snackbarSx?: SxProps<Theme> | undefined;
  alertSx?: SxProps<Theme> | undefined;
  transitionDuration?: { enter: number; exit: number } | undefined;
}

const snackbarPresets: Record<
  SnackbarSeverity,
  {
    autoHideDuration: number;
    anchorOrigin: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
    transitionDuration: { enter: number; exit: number };
    snackbarSx?: SxProps<Theme> | undefined;
    alertSx: SxProps<Theme>;
  }
> = {
  success: {
    autoHideDuration: 3200,
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transitionDuration: { enter: 180, exit: 220 },
    snackbarSx: undefined,
    alertSx: { width: '100%' },
  },
  info: {
    autoHideDuration: 4000,
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transitionDuration: { enter: 180, exit: 220 },
    snackbarSx: undefined,
    alertSx: { width: '100%' },
  },
  warning: {
    autoHideDuration: 4500,
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transitionDuration: { enter: 180, exit: 240 },
    snackbarSx: undefined,
    alertSx: { width: '100%' },
  },
  error: {
    autoHideDuration: 5000,
    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
    transitionDuration: { enter: 140, exit: 180 },
    snackbarSx: { px: 1 },
    alertSx: {
      width: 'fit-content',
      maxWidth: 460,
      py: 0.5,
      '& .MuiAlert-message': { py: 0.5, pr: 1 },
      '& .MuiAlert-action': { pt: 0.5, pr: 0.75 },
    },
  },
};

export const AppSnackbar = ({
  open,
  message,
  children,
  severity = 'info',
  autoHideDuration,
  onClose,
  onExited,
  anchorOrigin,
  snackbarSx,
  alertSx,
  transitionDuration,
}: AppSnackbarProps) => {
  const preset = snackbarPresets[severity];

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration ?? preset.autoHideDuration}
      anchorOrigin={anchorOrigin ?? preset.anchorOrigin}
      sx={snackbarSx ?? preset.snackbarSx}
      slots={{ transition: Fade }}
      slotProps={{
        transition: { timeout: transitionDuration ?? preset.transitionDuration, onExited },
      }}
    >
      <Alert variant="filled" severity={severity} onClose={onClose} sx={alertSx ?? preset.alertSx}>
        {children ?? message}
      </Alert>
    </Snackbar>
  );
};
