import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import { plansService } from '@features/platform/plans/services/service';
import type { Plan, PlansQueryParams } from '@features/platform/plans/types/plans';

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const buildPagination = (queryParams: PlansQueryParams, totalItems: number): PaginationMeta => {
  const currentPage = queryParams.page ?? 1;
  const rowsPerPage = queryParams.limit ?? 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(rowsPerPage, 1)));

  return {
    page: currentPage,
    limit: rowsPerPage,
    total: totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

export const usePlansList = () => {
  const [rows, setRows] = useState<Plan[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [queryParams, setQueryParams] = useState<PlansQueryParams>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await plansService.list(queryParams);
      setRows(response.data);
      setPagination(buildPagination(queryParams, response.meta.total));
    } catch {
      setErrorMessage('Não foi possível carregar os planos.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPlans();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchPlans]);

  const updateQueryParams = (patch: Partial<PlansQueryParams>) => {
    setQueryParams((currentQueryParams) => {
      const nextQueryParams = { ...currentQueryParams, ...patch };

      if ('limit' in patch && patch.limit !== currentQueryParams.limit) {
        nextQueryParams.page = 1;
        return nextQueryParams;
      }

      if (!('page' in patch)) {
        nextQueryParams.page = 1;
      }

      return nextQueryParams;
    });
  };

  return {
    rows,
    pagination,
    queryParams,
    loading,
    errorMessage,
    updateQueryParams,
    reload: fetchPlans,
  };
};
