import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plansService } from '@features/platform/plans/services/service';
import type { Plan } from '@features/platform/plans/types/plans';

export const usePlanDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedPlan = await plansService.getById(id);
      setEntity(fetchedPlan);
    } catch {
      setErrorMessage('Não foi possível carregar o plano.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPlan();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchPlan]);

  return {
    entity,
    loading,
    errorMessage,
    onBack: () => {
      void navigate('/platform/plans');
    },
    onRetry: fetchPlan,
  };
};
