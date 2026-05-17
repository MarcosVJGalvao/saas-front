import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreatePlanRequest } from '@features/platform/plans/types/plans';
import { usePlansMutations } from '@features/platform/plans/hooks/usePlansMutations';
import { normalizePlanPayload } from '@features/platform/plans/normalizers/planPayloadNormalizer';

const initialValue: CreatePlanRequest = {
  name: '',
  description: '',
  price: '',
  currency: 'BRL',
  billingCycle: 'monthly',
  trialDays: 0,
  isActive: true,
};

export const usePlanCreatePage = () => {
  const navigate = useNavigate();
  const mutations = usePlansMutations();
  const [defaultValues] = useState<CreatePlanRequest>(initialValue);
  const handleSubmit = useCallback(
    async (payload: CreatePlanRequest) => {
      const created = await mutations.create(normalizePlanPayload(payload));
      if (created) {
        void navigate(`/platform/plans/${created.id}`);
      }
    },
    [mutations, navigate],
  );
  return useMemo(
    () => ({ defaultValues, loading: mutations.loading, handleSubmit }),
    [defaultValues, mutations.loading, handleSubmit],
  );
};
