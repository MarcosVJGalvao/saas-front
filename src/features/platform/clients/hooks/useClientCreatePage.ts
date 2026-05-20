import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  createClientCreateInitialValues,
  toClientCreatePayload,
} from '@features/platform/clients/normalizers/clientForm.normalizer';
import { clientCreateFormSchema } from '@features/platform/clients/schemas/clientCreateForm.schema';
import type { ClientCreateFormValues } from '@features/platform/clients/schemas/clientCreateForm.schema';
import { clientsService } from '@features/platform/clients/services/service';

export const useClientCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<ClientCreateFormValues>(
    clientCreateFormSchema,
    createClientCreateInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (formValues: ClientCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const createdClient = await clientsService.create(toClientCreatePayload(formValues));
      void navigate(`/platform/clients/${createdClient.id}`);
    } catch {
      setErrorMessage('Não foi possível cadastrar o cliente.');
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
      void navigate('/platform/clients');
    },
  };
};
