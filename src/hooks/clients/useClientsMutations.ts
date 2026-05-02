import { useState } from 'react';
import type {
  Client,
  ClientOnboardingResponse,
  CreateClientOnboardingRequest,
  CreateClientRequest,
  UpdateClientRequest,
} from '../../models/clients';
import { clientsService } from '../../services/platform/clients/service';

export const useClientsMutations = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const run = async <T>(callback: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      return await callback();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro na opera��o.');
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
