import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Client } from '@features/platform/clients/types/clients';
import { clientsService } from '@features/platform/clients/services/service';

export const useClientDetails = (id?: string) => {
  const [data, setData] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchOne = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const result = await clientsService.getById(id);
      setData(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar cliente.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchOne();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchOne]);

  return useMemo(
    () => ({ data, loading, errorMessage, refresh: fetchOne }),
    [data, loading, errorMessage, fetchOne],
  );
};
