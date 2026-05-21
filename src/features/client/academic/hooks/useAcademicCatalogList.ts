import { useCallback, useEffect, useState } from 'react';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';
import type {
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
} from '@features/client/academic/types/academic.types';
import type { PaginationMeta } from '@shared/types/pagination';

type AcademicCatalogListService = Pick<
  ClientCrudService<
    AcademicCatalogItem,
    AcademicCatalogItem,
    Record<string, unknown>,
    Record<string, unknown>,
    AcademicCatalogQueryParams
  >,
  'list'
>;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useAcademicCatalogList = (
  service: AcademicCatalogListService,
  errorMessageFallback: string,
  initialParams?: Partial<AcademicCatalogQueryParams>,
) => {
  const [rows, setRows] = useState<AcademicCatalogItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<AcademicCatalogQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

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

  const updateQuery = useCallback((patch: Partial<AcademicCatalogQueryParams>) => {
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
