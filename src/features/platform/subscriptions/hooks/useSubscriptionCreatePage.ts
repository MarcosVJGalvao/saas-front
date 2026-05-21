import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { usePlatformSubscriptionReferenceOptions } from '@features/platform/subscriptions/hooks/usePlatformSubscriptionReferenceOptions';
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
  const referenceOptions = usePlatformSubscriptionReferenceOptions();
  const form = useAppForm<SubscriptionCreateFormValues>(
    subscriptionCreateFormSchema,
    initialFormValues,
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

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
    referenceOptions,
    loadingPlans: referenceOptions.loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/platform/subscriptions');
    },
  };
};
