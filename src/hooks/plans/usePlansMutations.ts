import { useState } from 'react';
import { ErrorHandler } from '../../errors/ErrorHandler';
import type { CreatePlanRequest, Plan, UpdatePlanRequest } from '../../models/plans';
import { plansService } from '../../services/platform/plans/service';
import { useError } from '../useError/useError';

export const usePlansMutations = () => {
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
    create: (payload: CreatePlanRequest): Promise<Plan | null> =>
      run(() => plansService.create(payload)),
    update: (id: string, payload: UpdatePlanRequest): Promise<Plan | null> =>
      run(() => plansService.update(id, payload)),
    remove: (id: string): Promise<void | null> =>
      run(async () => {
        await plansService.remove(id);
      }),
  };
};
