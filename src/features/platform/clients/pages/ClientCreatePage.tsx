import { AppForm } from '@shared/components/form/AppForm';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { ClientFormFields } from '@features/platform/clients/components/ClientFormFields';
import { useClientCreatePageViewModel } from '@features/platform/clients/hooks/useClientCreatePageViewModel';

const ClientCreatePage = () => {
  const model = useClientCreatePageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader title={model.title} />
      <AppForm form={model.form} onSubmit={(payload) => void model.handleSubmit(payload)}>
        <ClientFormFields
          form={model.form}
          documentTypeOptions={model.documentTypeOptions}
          clientStatusOptions={model.clientStatusOptions}
        />
        <AppButton type="submit" disabled={model.isSubmitDisabled}>
          {model.submitLabel}
        </AppButton>
      </AppForm>
    </AppStack>
  );
};

export default ClientCreatePage;
