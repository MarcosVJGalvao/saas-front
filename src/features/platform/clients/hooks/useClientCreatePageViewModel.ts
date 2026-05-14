import { useAppForm } from '@shared/hooks/useAppForm';
import { activeInactiveStatusLabels, documentTypeLabels } from '@shared/i18n/pt-BR/enums';
import { useClientCreatePage } from '@features/platform/clients/hooks/useClientCreatePage';
import { createClientSchema } from '@features/platform/clients/schemas/clientsSchemas';

const documentTypeOptions = Object.entries(documentTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

const clientStatusOptions = Object.entries(activeInactiveStatusLabels).map(([value, label]) => ({
  value,
  label,
}));

export const useClientCreatePageViewModel = () => {
  const view = useClientCreatePage();
  const form = useAppForm(createClientSchema, view.value);
  const isSubmitting = view.loading || form.formState.isSubmitting;

  return {
    title: 'Novo Cliente',
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
