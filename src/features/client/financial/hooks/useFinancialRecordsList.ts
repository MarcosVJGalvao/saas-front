import { useCallback, useEffect, useRef, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import type {
  FinancialRecord,
  FinancialRecordQueryParams,
} from '@features/client/financial/types/financial.types';

type FinancialRecordsListService = {
  list: (params: FinancialRecordQueryParams) => Promise<{
    data: FinancialRecord[];
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

export const useFinancialRecordsList = (
  service: FinancialRecordsListService,
  errorMessageFallback: string,
) => {
  const serviceRef = useRef(service);
  const [rows, setRows] = useState<FinancialRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<FinancialRecordQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await serviceRef.current.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage(errorMessageFallback);
    } finally {
      setLoading(false);
    }
  }, [errorMessageFallback, query]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const updateQuery = useCallback((patch: Partial<FinancialRecordQueryParams>) => {
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
