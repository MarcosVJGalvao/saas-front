import { useCallback, useEffect, useState } from 'react';
import type { PaginatedResponse, PaginationMeta } from '@shared/types/pagination';

type BaseQueryParams = {
  page?: number;
  limit?: number;
};

type ListService<TRow, TParams extends BaseQueryParams> = (
  params: TParams,
) => Promise<PaginatedResponse<TRow>>;

const defaultMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const createListPageHook = <TRow, TParams extends BaseQueryParams>(
  service: ListService<TRow, TParams>,
  initialParams: TParams,
  errorMessage: string,
) => {
  return () => {
    const [rows, setRows] = useState<TRow[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
    const [query, setQuery] = useState<TParams>(initialParams);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const load = useCallback(async () => {
      setLoading(true);
      setError(undefined);
      try {
        const response = await service(query);
        setRows(response.data);
        setMeta(response.meta);
      } catch {
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [query]);

    useEffect(() => {
      const timeoutId = window.setTimeout(() => {
        void load();
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }, [load]);

    const updateQuery = useCallback((patch: Partial<TParams>) => {
      setQuery((current) => ({ ...current, ...patch }));
    }, []);

    return {
      rows,
      meta,
      query,
      loading,
      errorMessage: error,
      updateQuery,
      reload: load,
    };
  };
};
