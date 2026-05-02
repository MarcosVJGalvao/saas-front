import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Client, ClientsQueryParams } from '../../models/clients';
import type { PaginationMeta } from '../../models/pagination';
import { clientsService } from '../../services/platform/clients/service';

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
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [query, setQuery] = useState<ClientsQueryParams>({ page: 1, limit: 10, ...initialQuery });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await clientsService.list(query);
      setRows(response.data);
      setMeta(response.meta ?? defaultMeta);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar clientes.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const updateQuery = useCallback((patch: Partial<ClientsQueryParams>) => {
    setQuery((previous) => ({ ...previous, ...patch }));
  }, []);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({ rows, meta, query, loading, errorMessage, updateQuery, refresh }),
    [rows, meta, query, loading, errorMessage, updateQuery, refresh],
  );
};
