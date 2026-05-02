import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreatePlanRequest } from '../../models/plans';
import { usePlansMutations } from './usePlansMutations';

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
  const [value, setValue] = useState<CreatePlanRequest>(initialValue);
  const handleSubmit = useCallback(async () => {
    const created = await mutations.create(value);
    if (created) {
      void navigate(`/platform/plans/${created.id}`);
    }
  }, [mutations, navigate, value]);
  return useMemo(
    () => ({ value, setValue, loading: mutations.loading, handleSubmit }),
    [value, mutations.loading, handleSubmit],
  );
};
