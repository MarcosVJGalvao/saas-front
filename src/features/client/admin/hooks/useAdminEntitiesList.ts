import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import type {
  ClientAdminEntity,
  ClientAdminQueryParams,
} from '@features/client/admin/types/admin.types';

type AdminEntitiesListService<TItem extends ClientAdminEntity> = {
  list: (params: ClientAdminQueryParams) => Promise<{
    data: TItem[];
    meta: PaginationMeta;
  }>;
};

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useAdminEntitiesList = <TItem extends ClientAdminEntity>(
  service: AdminEntitiesListService<TItem>,
  errorMessageFallback: string,
) => {
  const [rows, setRows] = useState<TItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<ClientAdminQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await service.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage(errorMessageFallback);
    } finally {
      setLoading(false);
    }
  }, [errorMessageFallback, query, service]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const updateQuery = useCallback((patch: Partial<ClientAdminQueryParams>) => {
    setQuery((currentQuery) => ({ ...currentQuery, ...patch }));
  }, []);

  return {
    rows,
    meta,
    query,
    loading,
    errorMessage,
    updateQuery,
    reload: load,
  };
};
