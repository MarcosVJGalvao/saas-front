import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Subscription } from '../../models/subscriptions';
import { subscriptionsService } from '../../services/platform/subscriptions/service';

export const useSubscriptionDetails = (id?: string, tenantId?: string) => {
  const [data, setData] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchOne = useCallback(async () => {
    if (!id || !tenantId) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      setData(await subscriptionsService.getById(id, tenantId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar assinatura.');
    } finally {
      setLoading(false);
    }
  }, [id, tenantId]);

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
