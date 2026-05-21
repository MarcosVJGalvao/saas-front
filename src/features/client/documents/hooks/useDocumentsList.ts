import { useCallback, useEffect, useState } from 'react';
import { documentsService } from '@features/client/documents/services/service';
import type {
  GeneratedDocument,
  GeneratedDocumentQueryParams,
} from '@features/client/documents/types/document.types';
import type { PaginationMeta } from '@shared/types/pagination';

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useDocumentsList = () => {
  const [rows, setRows] = useState<GeneratedDocument[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(initialMeta);
  const [queryParams, setQueryParams] = useState<GeneratedDocumentQueryParams>({
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await documentsService.list(queryParams);
      setRows(response.data);
      setPagination(response.meta);
    } catch {
      setErrorMessage('Erro ao carregar documentos.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const updateQueryParams = useCallback((patch: Partial<GeneratedDocumentQueryParams>) => {
    setQueryParams((currentQuery) => ({ ...currentQuery, ...patch }));
  }, []);

  return {
    rows,
    pagination,
    queryParams,
    loading,
    errorMessage,
    updateQueryParams,
    reload: load,
  };
};
