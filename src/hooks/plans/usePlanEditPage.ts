import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CreatePlanRequest } from '../../models/plans';
import { plansService } from '../../services/platform/plans/service';
import { usePlansMutations } from './usePlansMutations';

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
  const [value, setValue] = useState<CreatePlanRequest>(emptyValue);
  useEffect(() => {
    void plansService.getById(id).then((plan) =>
      setValue({
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
  const handleSubmit = useCallback(async () => {
    const updated = await mutations.update(id, value);
    if (updated) {
      void navigate(`/platform/plans/${updated.id}`);
    }
  }, [id, mutations, navigate, value]);
  return useMemo(
    () => ({ value, setValue, loading: mutations.loading, handleSubmit }),
    [value, mutations.loading, handleSubmit],
  );
};
