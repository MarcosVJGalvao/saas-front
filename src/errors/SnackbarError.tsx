import { AppSnackbar } from '../components/common/feedback/AppSnackbar';
import { AppSnackbarErrorContent } from '../components/common/feedback/AppSnackbarErrorContent';
import type { AppError } from '../models/types';

interface SnackbarErrorProps {
  open: boolean;
  error: AppError | null;
  onClose: () => void;
  onExited: () => void;
}

export const SnackbarError = ({ open, error, onClose, onExited }: SnackbarErrorProps) => {
  if (error === null) {
    return null;
  }

  return (
    <AppSnackbar open={open} severity="error" onClose={onClose} onExited={onExited}>
      <AppSnackbarErrorContent error={error} />
    </AppSnackbar>
  );
};
