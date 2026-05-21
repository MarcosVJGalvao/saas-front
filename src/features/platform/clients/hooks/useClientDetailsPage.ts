import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { toClientDetailsData } from '@features/platform/clients/normalizers/clientDetails.normalizer';
import { clientsService } from '@features/platform/clients/services/service';
import type { Client } from '@features/platform/clients/types/clients';

const emptyDetailsData: EntityDetailsPageData = {
  headerData: null,
  tabs: [],
};

export const useClientDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchClient = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedClient = await clientsService.getById(id);
      setClient(fetchedClient);
    } catch {
      setErrorMessage('Não foi possível carregar o cliente.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchClient();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchClient]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : client
        ? 'ready'
        : 'empty';

  return {
    viewState,
    data: client ? toClientDetailsData(client) : emptyDetailsData,
    errorMessage,
    onBack: () => {
      void navigate('/platform/clients');
    },
    onRetry: fetchClient,
  };
};
