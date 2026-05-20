import { useCallback, useEffect, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import { subscriptionsService } from '@features/platform/subscriptions/services/service';
import type {
  Subscription,
  SubscriptionsQueryParams,
} from '@features/platform/subscriptions/types/subscriptions';

const initialPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const buildPagination = (
  queryParams: SubscriptionsQueryParams,
  totalItems: number,
): PaginationMeta => {
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

export const useSubscriptionsList = (initialQueryParams?: SubscriptionsQueryParams) => {
  const [rows, setRows] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [queryParams, setQueryParams] = useState<SubscriptionsQueryParams>({
    page: 1,
    limit: 10,
    ...initialQueryParams,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await subscriptionsService.list(queryParams);
      setRows(response.data);
      setPagination(buildPagination(queryParams, response.meta.total));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Não foi possível carregar as assinaturas.',
      );
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSubscriptions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchSubscriptions]);

  const updateQueryParams = (patch: Partial<SubscriptionsQueryParams>) => {
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
    reload: fetchSubscriptions,
  };
};
