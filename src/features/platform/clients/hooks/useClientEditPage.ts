import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  toClientEditFormValues,
  toClientEditPayload,
} from '@features/platform/clients/normalizers/clientForm.normalizer';
import { clientEditFormSchema } from '@features/platform/clients/schemas/clientEditForm.schema';
import type { ClientEditFormValues } from '@features/platform/clients/schemas/clientEditForm.schema';
import { clientsService } from '@features/platform/clients/services/service';
import type { Client } from '@features/platform/clients/types/clients';

type ClientEditLocationState = {
  entity?: Client;
};

const isClientEditLocationState = (value: unknown): value is ClientEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useClientEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = isClientEditLocationState(location.state) ? location.state : undefined;
  const [client, setClient] = useState<Client | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<ClientEditFormValues>(
    clientEditFormSchema,
    locationState?.entity
      ? toClientEditFormValues(locationState.entity)
      : {
          legalName: '',
          tradeName: '',
          email: '',
          phone: '',
          status: 'active',
          logoUrl: '',
          website: '',
          industry: '',
          notes: '',
        },
  );

  const fetchClient = useCallback(async () => {
    if (locationState?.entity) {
      form.reset(toClientEditFormValues(locationState.entity));
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedClient = await clientsService.getById(id);
      setClient(fetchedClient);
      form.reset(toClientEditFormValues(fetchedClient));
    } catch {
      setErrorMessage('Não foi possível carregar o cliente para edição.');
    } finally {
      setLoading(false);
    }
  }, [form, id, locationState]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchClient();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchClient]);

  const handleSubmit = async (formValues: ClientEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const updatedClient = await clientsService.update(id, toClientEditPayload(formValues));
      void navigate(`/platform/clients/${updatedClient.id}`);
    } catch {
      setErrorMessage('Não foi possível salvar as alterações do cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    client,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/platform/clients');
    },
  };
};
