import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { toPlanCreatePayload } from '@features/platform/plans/normalizers/planForm.normalizer';
import { planCreateFormSchema } from '@features/platform/plans/schemas/planCreateForm.schema';
import type { PlanCreateFormValues } from '@features/platform/plans/schemas/planCreateForm.schema';
import { plansService } from '@features/platform/plans/services/service';

const initialFormValues: PlanCreateFormValues = {
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
  const form = useAppForm<PlanCreateFormValues>(planCreateFormSchema, initialFormValues);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (values: PlanCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const createdPlan = await plansService.create(toPlanCreatePayload(values));
      void navigate(`/platform/plans/${createdPlan.id}`);
    } catch {
      setErrorMessage('Não foi possível cadastrar o plano.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/platform/plans');
    },
  };
};
