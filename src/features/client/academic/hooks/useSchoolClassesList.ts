import { useCallback, useEffect, useState } from 'react';
import { schoolClassService } from '@features/client/academic/services/service';
import type {
  SchoolClass,
  SchoolClassQueryParams,
} from '@features/client/academic/types/academic.types';
import type { PaginationMeta } from '@shared/types/pagination';

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useSchoolClassesList = () => {
  const [rows, setRows] = useState<SchoolClass[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [query, setQuery] = useState<SchoolClassQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await schoolClassService.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Erro ao carregar turmas.');
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

  const updateQuery = useCallback((patch: Partial<SchoolClassQueryParams>) => {
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
