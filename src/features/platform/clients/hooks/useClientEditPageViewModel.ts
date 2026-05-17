import { useEffect } from 'react';
import { useAppForm } from '@shared/hooks/useAppForm';
import { activeInactiveStatusLabels, documentTypeLabels } from '@shared/i18n/pt-BR/enums';
import { useClientEditPage } from '@features/platform/clients/hooks/useClientEditPage';
import { createClientSchema } from '@features/platform/clients/schemas/clientsSchemas';

const documentTypeOptions = Object.entries(documentTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

const clientStatusOptions = Object.entries(activeInactiveStatusLabels).map(([value, label]) => ({
  value,
  label,
}));

export const useClientEditPageViewModel = () => {
  const view = useClientEditPage();
  const form = useAppForm(createClientSchema, view.value);
  const isSubmitting = view.loading || form.formState.isSubmitting;

  useEffect(() => {
    form.reset(view.value);
  }, [form, view.value]);

  return {
    title: 'Editar Cliente',
    submitLabel: 'Salvar',
    form,
    viewState: 'ready',
    isSubmitting,
    isSubmitDisabled: isSubmitting,
    handleSubmit: view.handleSubmit,
    documentTypeOptions,
    clientStatusOptions,
  };
};
