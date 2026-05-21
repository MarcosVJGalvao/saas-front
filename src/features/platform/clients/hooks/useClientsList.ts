import { useCallback, useEffect, useState } from 'react';
import type { Client, ClientsQueryParams } from '@features/platform/clients/types/clients';
import type { PaginationMeta } from '@shared/types/pagination';
import { clientsService } from '@features/platform/clients/services/service';

const defaultMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useClientsList = (initialQuery?: ClientsQueryParams) => {
  const [rows, setRows] = useState<Client[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(defaultMeta);
  const [queryParams, setQueryParams] = useState<ClientsQueryParams>({
    page: 1,
    limit: 10,
    ...initialQuery,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await clientsService.list(queryParams);
      setRows(response.data);
      setPagination(response.meta ?? defaultMeta);
    } catch {
      setErrorMessage('Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const updateQueryParams = useCallback((patch: Partial<ClientsQueryParams>) => {
    setQueryParams((currentQueryParams) => ({ ...currentQueryParams, ...patch }));
  }, []);

  const reload = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    rows,
    pagination,
    queryParams,
    loading,
    errorMessage,
    updateQueryParams,
    reload,
  };
};
