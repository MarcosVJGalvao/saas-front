import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Plan } from '../../models/plans';
import type { CreateSubscriptionRequest } from '../../models/subscriptions';
import { plansService } from '../../services/platform/plans/service';
import { useSubscriptionsMutations } from './useSubscriptionsMutations';

const initialValue: CreateSubscriptionRequest = {
  tenantId: '',
  planId: '',
  status: 'active',
  priceAtSubscription: '',
};

export const useSubscriptionCreatePage = () => {
  const navigate = useNavigate();
  const mutations = useSubscriptionsMutations();
  const [defaultValues] = useState<CreateSubscriptionRequest>(initialValue);
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    void plansService
      .list({ page: 1, limit: 100 })
      .then((response) => setPlans(response.data.filter((plan) => plan.isActive)));
  }, []);
  const handleSubmit = useCallback(
    async (payload: CreateSubscriptionRequest) => {
      const created = await mutations.create(payload);
      if (created) {
        void navigate(`/platform/subscriptions/${created.id}?tenantId=${created.tenantId}`);
      }
    },
    [mutations, navigate],
  );
  return useMemo(
    () => ({ defaultValues, plans, loading: mutations.loading, handleSubmit }),
    [defaultValues, plans, mutations.loading, handleSubmit],
  );
};
