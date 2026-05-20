import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { plansService } from '@features/platform/plans/services/service';
import type { Plan } from '@features/platform/plans/types/plans';
import { toSubscriptionCreatePayload } from '@features/platform/subscriptions/normalizers/subscriptionForm.normalizer';
import { subscriptionCreateFormSchema } from '@features/platform/subscriptions/schemas/subscriptionCreateForm.schema';
import type { SubscriptionCreateFormValues } from '@features/platform/subscriptions/schemas/subscriptionCreateForm.schema';
import { subscriptionsService } from '@features/platform/subscriptions/services/service';

const initialFormValues: SubscriptionCreateFormValues = {
  tenantId: '',
  planId: '',
  status: 'active',
  startDate: '',
  endDate: '',
  trialEndsAt: '',
  renewalDate: '',
  priceAtSubscription: '',
  blockedReason: '',
};

export const useSubscriptionCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<SubscriptionCreateFormValues>(
    subscriptionCreateFormSchema,
    initialFormValues,
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    const fetchPlans = async (): Promise<void> => {
      setLoadingPlans(true);
      try {
        const response = await plansService.list({ page: 1, limit: 100 });
        setPlans(response.data.filter((plan) => plan.isActive));
      } catch {
        setErrorMessage('Não foi possível carregar os planos disponíveis.');
      } finally {
        setLoadingPlans(false);
      }
    };

    void fetchPlans();
  }, []);

  const handleSubmit = async (values: SubscriptionCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const createdSubscription = await subscriptionsService.create(
        toSubscriptionCreatePayload(values),
      );
      void navigate(
        `/platform/subscriptions/${createdSubscription.id}?tenantId=${createdSubscription.tenantId}`,
      );
    } catch {
      setErrorMessage('Não foi possível cadastrar a assinatura.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    plans,
    loadingPlans,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/platform/subscriptions');
    },
  };
};
