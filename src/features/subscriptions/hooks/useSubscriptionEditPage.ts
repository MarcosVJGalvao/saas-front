import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Plan } from '@features/plans/types/plans';
import type { CreateSubscriptionRequest } from '@features/subscriptions/types/subscriptions';
import { plansService } from '@features/plans/services/service';
import { subscriptionsService } from '@features/subscriptions/services/service';
import { useSubscriptionsMutations } from '@features/subscriptions/hooks/useSubscriptionsMutations';
import { normalizeSubscriptionPayload } from '@features/subscriptions/normalizers/subscriptionPayloadNormalizer';

const emptyValue: CreateSubscriptionRequest = {
  tenantId: '',
  planId: '',
  status: 'active',
  priceAtSubscription: '',
};

export const useSubscriptionEditPage = () => {
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenantId') ?? '';
  const navigate = useNavigate();
  const mutations = useSubscriptionsMutations();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [defaultValues, setDefaultValues] = useState<CreateSubscriptionRequest>(emptyValue);
  useEffect(() => {
    void plansService
      .list({ page: 1, limit: 100 })
      .then((response) => setPlans(response.data.filter((plan) => plan.isActive)));
  }, []);
  useEffect(() => {
    if (!tenantId) return;
    void subscriptionsService.getById(id, tenantId).then((subscription) =>
      setDefaultValues({
        tenantId: subscription.tenantId,
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate ?? undefined,
        trialEndsAt: subscription.trialEndsAt ?? undefined,
        renewalDate: subscription.renewalDate ?? undefined,
        priceAtSubscription: subscription.priceAtSubscription,
        blockedReason: subscription.blockedReason ?? undefined,
      }),
    );
  }, [id, tenantId]);
  const handleSubmit = useCallback(
    async (payload: CreateSubscriptionRequest) => {
      if (!tenantId) return;
      const updated = await mutations.update(id, tenantId, normalizeSubscriptionPayload(payload));
      if (updated) {
        void navigate(`/platform/subscriptions/${updated.id}?tenantId=${updated.tenantId}`);
      }
    },
    [id, tenantId, mutations, navigate],
  );
  return useMemo(
    () => ({ defaultValues, plans, loading: mutations.loading, handleSubmit, tenantId }),
    [defaultValues, plans, mutations.loading, handleSubmit, tenantId],
  );
};
