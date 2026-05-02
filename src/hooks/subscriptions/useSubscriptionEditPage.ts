import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Plan } from '../../models/plans';
import type { CreateSubscriptionRequest } from '../../models/subscriptions';
import { plansService } from '../../services/platform/plans/service';
import { subscriptionsService } from '../../services/platform/subscriptions/service';
import { useSubscriptionsMutations } from './useSubscriptionsMutations';

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
  const [value, setValue] = useState<CreateSubscriptionRequest>(emptyValue);
  useEffect(() => {
    void plansService
      .list({ page: 1, limit: 100 })
      .then((response) => setPlans(response.data.filter((plan) => plan.isActive)));
  }, []);
  useEffect(() => {
    if (!tenantId) return;
    void subscriptionsService.getById(id, tenantId).then((subscription) =>
      setValue({
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
  const handleSubmit = useCallback(async () => {
    if (!tenantId) return;
    const updated = await mutations.update(id, tenantId, value);
    if (updated) {
      void navigate(`/platform/subscriptions/${updated.id}?tenantId=${updated.tenantId}`);
    }
  }, [id, tenantId, mutations, navigate, value]);
  return useMemo(
    () => ({ value, setValue, plans, loading: mutations.loading, handleSubmit, tenantId }),
    [value, plans, mutations.loading, handleSubmit, tenantId],
  );
};
