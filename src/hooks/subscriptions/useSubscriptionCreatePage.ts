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
  const [value, setValue] = useState<CreateSubscriptionRequest>(initialValue);
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    void plansService
      .list({ page: 1, limit: 100 })
      .then((response) => setPlans(response.data.filter((plan) => plan.isActive)));
  }, []);
  const handleSubmit = useCallback(async () => {
    const created = await mutations.create(value);
    if (created) {
      void navigate(`/platform/subscriptions/${created.id}?tenantId=${created.tenantId}`);
    }
  }, [mutations, navigate, value]);
  return useMemo(
    () => ({ value, setValue, plans, loading: mutations.loading, handleSubmit }),
    [value, plans, mutations.loading, handleSubmit],
  );
};
