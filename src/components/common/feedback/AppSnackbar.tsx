import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';

interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity?: SnackbarSeverity;
  autoHideDuration?: number;
  onClose: () => void;
}

export const AppSnackbar = ({
  open,
  message,
  severity = 'info',
  autoHideDuration = 4000,
  onClose,
}: AppSnackbarProps) => (
  <Snackbar
    open={open}
    onClose={onClose}
    autoHideDuration={autoHideDuration}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  >
    <Alert variant="filled" severity={severity} onClose={onClose} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);
