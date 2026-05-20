import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptionsService } from '@features/platform/subscriptions/services/service';
import type { Subscription } from '@features/platform/subscriptions/types/subscriptions';

export const useSubscriptionDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenantId') ?? '';
  const [entity, setEntity] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchSubscription = useCallback(async () => {
    if (!tenantId) {
      setErrorMessage('Informe o tenant da assinatura para visualizar os detalhes.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedSubscription = await subscriptionsService.getById(id, tenantId);
      setEntity(fetchedSubscription);
    } catch {
      setErrorMessage('Não foi possível carregar a assinatura.');
    } finally {
      setLoading(false);
    }
  }, [id, tenantId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSubscription();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchSubscription]);

  return {
    entity,
    loading,
    errorMessage,
    onBack: () => {
      void navigate('/platform/subscriptions');
    },
    onRetry: fetchSubscription,
  };
};
