import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Plan } from '@features/plans/types/plans';
import { plansService } from '@features/plans/services/service';

export const usePlanDetails = (id?: string) => {
  const [data, setData] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchOne = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      setData(await plansService.getById(id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar plano.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchOne();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchOne]);

  return useMemo(
    () => ({ data, loading, errorMessage, refresh: fetchOne }),
    [data, loading, errorMessage, fetchOne],
  );
};
