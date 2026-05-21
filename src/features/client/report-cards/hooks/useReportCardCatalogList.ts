import { useCallback, useEffect, useRef, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import type {
  ReportCardPayload,
  ReportCardCatalogEntity,
  ReportCardQueryParams,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardCatalogListService = (
  params: ReportCardQueryParams,
) => Promise<{ data: ReportCardCatalogEntity[]; meta: PaginationMeta }>;

type ReportCardCatalogCreateService =
  | ((payload: ReportCardPayload) => Promise<ReportCardCatalogEntity>)
  | undefined;

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
  createService?: ReportCardCatalogCreateService,
) => {
  const serviceRef = useRef(service);
  const createServiceRef = useRef(createService);
  const [rows, setRows] = useState<ReportCardCatalogEntity[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<ReportCardQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  useEffect(() => {
    createServiceRef.current = createService;
  }, [createService]);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await serviceRef.current(query);
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

  const updateQuery = useCallback((patch: Partial<ReportCardQueryParams>) => {
    setQuery((currentQuery) => ({ ...currentQuery, ...patch }));
  }, []);

  const createRecord = useCallback(
    async (payload: ReportCardPayload, successMessageValue: string): Promise<void> => {
      if (createServiceRef.current === undefined) return;
      setLoading(true);
      setErrorMessage(undefined);
      setSuccessMessage(undefined);
      try {
        await createServiceRef.current(payload);
        setSuccessMessage(successMessageValue);
        await load();
      } catch {
        setErrorMessage('Não foi possível criar o registro.');
      } finally {
        setLoading(false);
      }
    },
    [load],
  );

  return {
    rows,
    meta,
    query,
    loading,
    errorMessage,
    successMessage,
    updateQuery,
    createRecord,
    reload: load,
  };
};
