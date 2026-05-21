import { useClientRoleCreatePage } from '@features/client/admin/hooks/useClientRoleCreatePage';
import type { ClientRoleCreateFormValues } from '@features/client/admin/schemas/clientRoleCreateForm.schema';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { activeInactiveStatusOptions } from '@shared/constants/selectOptions';

const ClientRoleCreatePage = () => {
  const clientRoleCreatePage = useClientRoleCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo perfil"
        subtitle="Cadastre perfis de acesso para organizar permissões do tenant."
        actionLabel="Voltar"
        onAction={clientRoleCreatePage.onBack}
      />
      {clientRoleCreatePage.errorMessage ? (
        <AppAlert severity="error">{clientRoleCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={clientRoleCreatePage.form}
          onSubmit={clientRoleCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<ClientRoleCreateFormValues> name="name" label="Nome" />
          <FormSelect<ClientRoleCreateFormValues>
            name="status"
            label="Status"
            options={activeInactiveStatusOptions}
          />
          <FormTextField<ClientRoleCreateFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: clientRoleCreatePage.onBack,
              disabled: clientRoleCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void clientRoleCreatePage.form.handleSubmit(clientRoleCreatePage.onSubmit)();
              },
              loading: clientRoleCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ClientRoleCreatePage;
