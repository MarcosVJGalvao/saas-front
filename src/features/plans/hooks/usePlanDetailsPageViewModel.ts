import { useParams } from 'react-router-dom';
import { usePlanDetails } from '@features/plans/hooks/usePlanDetails';
import type { Plan } from '@features/plans/types/plans';

type PlanDetailsViewState = 'loading' | 'error' | 'ready';

const emptyPlan: Plan = {
  id: '',
  name: '-',
  description: '-',
  price: '0.00',
  currency: 'BRL',
  billingCycle: 'monthly',
  trialDays: 0,
  isActive: false,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

const resolvePlanDetailsViewState = (
  loading: boolean,
  errorMessage: string | undefined,
): PlanDetailsViewState => {
  if (loading) return 'loading';
  if (errorMessage) return 'error';
  return 'ready';
};

export const usePlanDetailsPageViewModel = () => {
  const { id } = useParams();
  const { data, loading, errorMessage, refresh } = usePlanDetails(id);

  return {
    data: data ?? emptyPlan,
    errorMessage,
    refresh,
    viewState: resolvePlanDetailsViewState(loading, errorMessage),
  };
};
