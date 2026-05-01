import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { ModalError } from '../../errors/ModalError';
import { SnackbarError } from '../../errors/SnackbarError';
import { ErrorDisplayMode, type AppError } from '../../models/types';

interface ErrorContextValue {
  pushError: (error: AppError) => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

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

export const useError = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError deve ser usado dentro de ErrorProvider.');
  }
  return context;
};
