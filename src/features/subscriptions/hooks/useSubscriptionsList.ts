import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PaginationMeta } from '@models/pagination';
import type {
  Subscription,
  SubscriptionsQueryParams,
} from '@features/subscriptions/types/subscriptions';
import { subscriptionsService } from '@features/subscriptions/services/service';
const QUERY_DEBOUNCE_IN_MILLISECONDS = 400;

const defaultMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const toNumberOrDefault = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return fallback;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const resolveMeta = (
  response: unknown,
  query: SubscriptionsQueryParams,
  fallback: PaginationMeta,
): PaginationMeta => {
  if (isObject(response) && isObject(response.meta)) {
    const page = toNumberOrDefault(response.meta.page, fallback.page);
    const limit = toNumberOrDefault(response.meta.limit, fallback.limit);
    const total = toNumberOrDefault(response.meta.total, fallback.total);
    return {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / Math.max(limit, 1))),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    };
  }

  if (isObject(response)) {
    const page = toNumberOrDefault(response.page, query.page ?? fallback.page);
    const limit = toNumberOrDefault(response.limit, query.limit ?? fallback.limit);
    const total = toNumberOrDefault(response.total, fallback.total);

    return {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / Math.max(limit, 1))),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    };
  }

  return fallback;
};

export const useSubscriptionsList = (initialQuery?: SubscriptionsQueryParams) => {
  const [rows, setRows] = useState<Subscription[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [query, setQuery] = useState<SubscriptionsQueryParams>({
    page: 1,
    limit: 10,
    ...initialQuery,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await subscriptionsService.list(query);
      setRows(response.data);
      setMeta(resolveMeta(response, query, defaultMeta));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar assinaturas.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const updateQuery = useCallback(
    (patch: Partial<SubscriptionsQueryParams>) => setQuery((prev) => ({ ...prev, ...patch })),
    [],
  );

  useEffect(() => {
    const hasStartDate = query.startDate !== undefined && query.startDate.length > 0;
    const hasEndDate = query.endDate !== undefined && query.endDate.length > 0;
    const hasPartialPeriod = (hasStartDate && !hasEndDate) || (!hasStartDate && hasEndDate);

    if (hasPartialPeriod) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, QUERY_DEBOUNCE_IN_MILLISECONDS);
    return () => window.clearTimeout(timeoutId);
  }, [fetchData, query.startDate, query.endDate]);

  return useMemo(
    () => ({ rows, meta, query, loading, errorMessage, updateQuery, refresh: fetchData }),
    [rows, meta, query, loading, errorMessage, updateQuery, fetchData],
  );
};
