import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { isRecord } from '@shared/utils/isRecord';
import { plansService } from '@features/platform/plans/services/service';
import type { Plan } from '@features/platform/plans/types/plans';
import {
  toSubscriptionEditFormValues,
  toSubscriptionEditPayload,
} from '@features/platform/subscriptions/normalizers/subscriptionForm.normalizer';
import { subscriptionEditFormSchema } from '@features/platform/subscriptions/schemas/subscriptionEditForm.schema';
import type { SubscriptionEditFormValues } from '@features/platform/subscriptions/schemas/subscriptionEditForm.schema';
import { subscriptionsService } from '@features/platform/subscriptions/services/service';
import type { Subscription } from '@features/platform/subscriptions/types/subscriptions';

type SubscriptionEditLocationState = {
  entity?: Subscription;
};

const isSubscription = (value: unknown): value is Subscription =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.tenantId === 'string' &&
  typeof value.planId === 'string';

const getLocationState = (value: unknown): SubscriptionEditLocationState | null => {
  if (!isRecord(value)) {
    return null;
  }

  return isSubscription(value.entity) ? { entity: value.entity } : null;
};

const initialFormValues: SubscriptionEditFormValues = {
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

export const useSubscriptionEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenantId') ?? '';
  const locationState = getLocationState(location.state);
  const [subscription, setSubscription] = useState<Subscription | null>(
    locationState?.entity ?? null,
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<SubscriptionEditFormValues>(
    subscriptionEditFormSchema,
    initialFormValues,
  );

  const fetchPlans = useCallback(async () => {
    const response = await plansService.list({ page: 1, limit: 100 });
    setPlans(response.data.filter((plan) => plan.isActive));
  }, []);

  const fetchSubscription = useCallback(async () => {
    if (!tenantId) {
      setErrorMessage('Informe o tenant da assinatura para editar.');
      setLoading(false);
      return;
    }

    if (!locationState?.entity) {
      const fetchedSubscription = await subscriptionsService.getById(id, tenantId);
      setSubscription(fetchedSubscription);
      return;
    }

    setSubscription(locationState.entity);
  }, [id, locationState, tenantId]);

  useEffect(() => {
    const loadPage = async (): Promise<void> => {
      setLoading(true);
      setErrorMessage(undefined);
      try {
        await Promise.all([fetchPlans(), fetchSubscription()]);
      } catch {
        setErrorMessage('Não foi possível carregar a assinatura para edição.');
      } finally {
        setLoading(false);
      }
    };

    void loadPage();
  }, [fetchPlans, fetchSubscription]);

  useEffect(() => {
    if (!subscription) {
      return;
    }

    form.reset(toSubscriptionEditFormValues(subscription));
  }, [form, subscription]);

  const handleSubmit = async (values: SubscriptionEditFormValues): Promise<void> => {
    if (!tenantId) {
      setErrorMessage('Informe o tenant da assinatura para editar.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const updatedSubscription = await subscriptionsService.update(
        id,
        tenantId,
        toSubscriptionEditPayload(values),
      );
      void navigate(
        `/platform/subscriptions/${updatedSubscription.id}?tenantId=${updatedSubscription.tenantId}`,
      );
    } catch {
      setErrorMessage('Não foi possível salvar a assinatura.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    subscription,
    plans,
    tenantId,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate(
        subscription
          ? `/platform/subscriptions/${subscription.id}?tenantId=${subscription.tenantId}`
          : '/platform/subscriptions',
      );
    },
  };
};
