import { useState } from 'react';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import type {
  CancelSubscriptionRequest,
  CreateSubscriptionRequest,
  Subscription,
  SubscriptionPlanHistory,
  UpdateSubscriptionRequest,
} from '@features/platform/subscriptions/types/subscriptions';
import { subscriptionsService } from '@features/platform/subscriptions/services/service';
import { useError } from '@shared/hooks/useError/useError';

export const useSubscriptionsMutations = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { pushError } = useError();
  const run = async <T>(cb: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      return await cb();
    } catch (error) {
      const normalized = ErrorHandler.normalize(error);
      setErrorMessage(normalized.message);
      pushError(normalized);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    errorMessage,
    create: (payload: CreateSubscriptionRequest): Promise<Subscription | null> =>
      run(() => subscriptionsService.create(payload)),
    update: (
      id: string,
      tenantId: string,
      payload: UpdateSubscriptionRequest,
    ): Promise<Subscription | null> =>
      run(() => subscriptionsService.update(id, tenantId, payload)),
    cancel: (
      id: string,
      tenantId: string,
      payload: CancelSubscriptionRequest,
    ): Promise<Subscription | null> =>
      run(() => subscriptionsService.cancel(id, tenantId, payload)),
    remove: (id: string, tenantId: string): Promise<void | null> =>
      run(async () => {
        await subscriptionsService.remove(id, tenantId);
      }),
    history: (id: string, tenantId: string): Promise<SubscriptionPlanHistory[] | null> =>
      run(() => subscriptionsService.getPlanHistory(id, tenantId)),
  };
};
