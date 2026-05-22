import { useCallback, useEffect, useState } from 'react';
import { clientsService } from '@features/platform/clients/services/service';
import { subscriptionsService } from '@features/platform/subscriptions/services/service';

type PlatformDashboardSummary = {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  totalSubscriptions: number;
};

type PlatformDashboardPageState = {
  summary: PlatformDashboardSummary | undefined;
  loading: boolean;
  errorMessage: string | undefined;
  reload: () => Promise<void>;
};

export const usePlatformDashboardPage = (): PlatformDashboardPageState => {
  const [summary, setSummary] = useState<PlatformDashboardSummary | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const [allClients, activeClients, subscriptions] = await Promise.all([
        clientsService.list({ limit: 1, page: 1 }),
        clientsService.list({ limit: 1, page: 1, status: 'active' }),
        subscriptionsService.list({ limit: 1, page: 1 }),
      ]);
      const total = allClients.meta.total;
      const active = activeClients.meta.total;
      setSummary({
        totalClients: total,
        activeClients: active,
        inactiveClients: total - active,
        totalSubscriptions: subscriptions.meta.total,
      });
    } catch {
      setErrorMessage('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  return { summary, loading, errorMessage, reload: load };
};
