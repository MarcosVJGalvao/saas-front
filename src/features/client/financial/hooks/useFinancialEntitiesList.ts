import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';
import type {
  FinancialEntity,
  FinancialEntityPayload,
  FinancialEntityQueryParams,
} from '@features/client/financial/types/financial.types';

type FinancialEntitiesListService = Pick<
  ClientCrudService<
    FinancialEntity,
    FinancialEntity,
    FinancialEntityPayload,
    FinancialEntityPayload,
    FinancialEntityQueryParams
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

export const useFinancialEntitiesList = (
  service: FinancialEntitiesListService,
  errorMessageFallback: string,
) => {
  const [rows, setRows] = useState<FinancialEntity[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<FinancialEntityQueryParams>({ page: 1, limit: 10 });
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

  const updateQuery = useCallback((patch: Partial<FinancialEntityQueryParams>) => {
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
