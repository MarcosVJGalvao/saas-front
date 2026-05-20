import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import { legalGuardianService } from '../services/service';
import type { LegalGuardian, LegalGuardianQueryParams } from '../types/student.types';

export const useLegalGuardiansList = () => {
  const [rows, setRows] = useState<LegalGuardian[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [query, setQuery] = useState<LegalGuardianQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await legalGuardianService.list(query);
      setRows(response.data);
      setMeta(response.meta);
    } catch {
      setErrorMessage('Erro ao carregar responsáveis.');
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

  const updateQuery = useCallback((patch: Partial<LegalGuardianQueryParams>) => {
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
