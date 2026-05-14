import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CreatePlanRequest } from '@features/platform/plans/types/plans';
import { plansService } from '@features/platform/plans/services/service';
import { usePlansMutations } from '@features/platform/plans/hooks/usePlansMutations';
import { normalizePlanPayload } from '@features/platform/plans/normalizers/planPayloadNormalizer';

const emptyValue: CreatePlanRequest = {
  name: '',
  description: '',
  price: '',
  currency: 'BRL',
  billingCycle: 'monthly',
  trialDays: 0,
  isActive: true,
};

export const usePlanEditPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const mutations = usePlansMutations();
  const [defaultValues, setDefaultValues] = useState<CreatePlanRequest>(emptyValue);
  useEffect(() => {
    void plansService.getById(id).then((plan) =>
      setDefaultValues({
        name: plan.name,
        description: plan.description ?? '',
        price: plan.price,
        currency: plan.currency,
        billingCycle: plan.billingCycle,
        trialDays: plan.trialDays,
        isActive: plan.isActive,
      }),
    );
  }, [id]);
  const handleSubmit = useCallback(
    async (payload: CreatePlanRequest) => {
      const updated = await mutations.update(id, normalizePlanPayload(payload));
      if (updated) {
        void navigate(`/platform/plans/${updated.id}`);
      }
    },
    [id, mutations, navigate],
  );
  return useMemo(
    () => ({ defaultValues, loading: mutations.loading, handleSubmit }),
    [defaultValues, mutations.loading, handleSubmit],
  );
};
