import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { isRecord } from '@shared/utils/isRecord';
import {
  toPlanEditFormValues,
  toPlanEditPayload,
} from '@features/platform/plans/normalizers/planForm.normalizer';
import { planEditFormSchema } from '@features/platform/plans/schemas/planEditForm.schema';
import type { PlanEditFormValues } from '@features/platform/plans/schemas/planEditForm.schema';
import { plansService } from '@features/platform/plans/services/service';
import type { Plan } from '@features/platform/plans/types/plans';

type PlanEditLocationState = {
  entity?: Plan;
};

const isPlan = (value: unknown): value is Plan =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  typeof value.price === 'string' &&
  typeof value.currency === 'string';

const getLocationState = (value: unknown): PlanEditLocationState | null => {
  if (!isRecord(value)) {
    return null;
  }

  return isPlan(value.entity) ? { entity: value.entity } : null;
};

const initialFormValues: PlanEditFormValues = {
  name: '',
  description: '',
  price: '',
  currency: 'BRL',
  billingCycle: 'monthly',
  trialDays: 0,
  isActive: true,
};

export const usePlanEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = getLocationState(location.state);
  const [plan, setPlan] = useState<Plan | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(locationState?.entity ? false : true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<PlanEditFormValues>(planEditFormSchema, initialFormValues);

  const fetchPlan = useCallback(async () => {
    if (locationState?.entity) {
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedPlan = await plansService.getById(id);
      setPlan(fetchedPlan);
    } catch {
      setErrorMessage('Não foi possível carregar o plano.');
    } finally {
      setLoading(false);
    }
  }, [id, locationState?.entity]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPlan();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchPlan]);

  useEffect(() => {
    if (!plan) {
      return;
    }

    form.reset(toPlanEditFormValues(plan));
  }, [form, plan]);

  const handleSubmit = async (values: PlanEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const updatedPlan = await plansService.update(id, toPlanEditPayload(values));
      void navigate(`/platform/plans/${updatedPlan.id}`);
    } catch {
      setErrorMessage('Não foi possível salvar o plano.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    plan,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate(plan ? `/platform/plans/${plan.id}` : '/platform/plans');
    },
  };
};
