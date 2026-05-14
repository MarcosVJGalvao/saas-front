import { useContext } from 'react';
import { ErrorProvider } from '@app/providers/ErrorProvider';
import { ErrorContext, type ErrorContextValue } from '@app/providers/errorContext';

export { ErrorProvider };

export const useError = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError deve ser usado dentro de ErrorProvider.');
  }
  return context;
};
