import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import type {
  ReportCardCatalogEntity,
  ReportCardQueryParams,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogListService = (
  params: ReportCardQueryParams,
) => Promise<{ data: ReportCardCatalogEntity[]; meta: PaginationMeta }>;

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useReportCardCatalogList = (
  service: ReportCardCatalogListService,
  errorMessageFallback: string,
) => {
  const [rows, setRows] = useState<ReportCardCatalogEntity[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<ReportCardQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await service(query);
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

  const updateQuery = useCallback((patch: Partial<ReportCardQueryParams>) => {
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
