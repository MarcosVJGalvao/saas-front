import { useCallback, useState } from 'react';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { useError } from '@hooks/useError/useError';

export const useAsync = <T>(asyncFn: () => Promise<T>) => {
  const [loading, setLoading] = useState(false);
  const { pushError } = useError();

  const execute = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    try {
      return await asyncFn();
    } catch (error) {
      pushError(ErrorHandler.normalize(error));
      return null;
    } finally {
      setLoading(false);
    }
  }, [asyncFn, pushError]);

  return { loading, execute };
};
