import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ModalError } from '@shared/errors/ModalError';
import { SnackbarError } from '@shared/errors/SnackbarError';
import { ErrorDisplayMode, type AppError } from '@shared/types/appError';
import { ErrorContext } from '@app/providers/errorContext';

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarError, setSnackbarError] = useState<AppError | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalError, setModalError] = useState<AppError | null>(null);

  const pushError = useCallback((error: AppError) => {
    if (error.displayMode === ErrorDisplayMode.MODAL) {
      setModalError(error);
      return;
    }
    setSnackbarError(error);
    setSnackbarOpen(true);
  }, []);

  const value = useMemo(() => ({ pushError }), [pushError]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <SnackbarError
        open={snackbarOpen}
        error={snackbarError}
        onClose={() => setSnackbarOpen(false)}
        onExited={() => setSnackbarError(null)}
      />
      <ModalError error={modalError} onClose={() => setModalError(null)} />
    </ErrorContext.Provider>
  );
};
