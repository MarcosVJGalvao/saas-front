import { AppSnackbar } from '@shared/components/feedback/AppSnackbar';
import { AppSnackbarErrorContent } from '@shared/components/feedback/AppSnackbarErrorContent';
import type { AppError } from '@shared/types/appError';

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
