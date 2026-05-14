import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PaginationMeta } from '@shared/types/pagination';
import type { Plan, PlansQueryParams } from '@features/platform/plans/types/plans';
import { plansService } from '@features/platform/plans/services/service';

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
  query: PlansQueryParams,
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

export const usePlansList = (initialQuery?: PlansQueryParams) => {
  const [rows, setRows] = useState<Plan[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [query, setQuery] = useState<PlansQueryParams>({ page: 1, limit: 10, ...initialQuery });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await plansService.list(query);
      setRows(response.data);
      setMeta(resolveMeta(response, query, defaultMeta));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar planos.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const updateQuery = useCallback(
    (patch: Partial<PlansQueryParams>) => setQuery((prev) => ({ ...prev, ...patch })),
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  return useMemo(
    () => ({ rows, meta, query, loading, errorMessage, updateQuery, refresh: fetchData }),
    [rows, meta, query, loading, errorMessage, updateQuery, fetchData],
  );
};
