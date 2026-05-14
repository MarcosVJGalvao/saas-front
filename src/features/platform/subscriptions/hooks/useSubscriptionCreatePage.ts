import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Plan } from '@features/platform/plans/types/plans';
import type { CreateSubscriptionRequest } from '@features/platform/subscriptions/types/subscriptions';
import { plansService } from '@features/platform/plans/services/service';
import { useSubscriptionsMutations } from '@features/platform/subscriptions/hooks/useSubscriptionsMutations';
import { normalizeSubscriptionPayload } from '@features/platform/subscriptions/normalizers/subscriptionPayloadNormalizer';

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
      const created = await mutations.create(normalizeSubscriptionPayload(payload));
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
