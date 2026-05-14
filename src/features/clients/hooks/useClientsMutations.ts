import { useState } from 'react';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import type {
  Client,
  ClientOnboardingResponse,
  CreateClientOnboardingRequest,
  CreateClientRequest,
  UpdateClientRequest,
} from '@features/clients/types/clients';
import { clientsService } from '@features/clients/services/service';
import { useError } from '@hooks/useError/useError';

export const useClientsMutations = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { pushError } = useError();

  const run = async <T>(callback: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      return await callback();
    } catch (error) {
      const normalizedError = ErrorHandler.normalize(error);
      setErrorMessage(normalizedError.message);
      pushError(normalizedError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMessage,
    create: (payload: CreateClientRequest): Promise<Client | null> =>
      run(() => clientsService.create(payload)),
    update: (id: string, payload: UpdateClientRequest): Promise<Client | null> =>
      run(() => clientsService.update(id, payload)),
    remove: (id: string): Promise<void | null> =>
      run(async () => {
        await clientsService.remove(id);
      }),
    onboard: (payload: CreateClientOnboardingRequest): Promise<ClientOnboardingResponse | null> =>
      run(() => clientsService.onboard(payload)),
  };
};
