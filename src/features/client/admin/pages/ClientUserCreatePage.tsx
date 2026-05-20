import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientUserCreatePage } from '@features/client/admin/hooks/useClientUserCreatePage';
import type { ClientUserCreateFormValues } from '@features/client/admin/schemas/clientUserCreateForm.schema';

const ClientUserCreatePage = () => {
  const clientUserCreatePage = useClientUserCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo usuário"
        subtitle="Cadastre usuários e vincule perfis de acesso do tenant."
        actionLabel="Voltar"
        onAction={clientUserCreatePage.onBack}
      />
      {clientUserCreatePage.errorMessage ? (
        <AppAlert severity="error">{clientUserCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={clientUserCreatePage.form}
          onSubmit={clientUserCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<ClientUserCreateFormValues> name="name" label="Nome" />
          <FormTextField<ClientUserCreateFormValues> name="email" label="E-mail" />
          <FormTextField<ClientUserCreateFormValues>
            name="roleId"
            label="Perfil"
            placeholder="ID do perfil"
          />
          <FormTextField<ClientUserCreateFormValues>
            name="status"
            label="Status"
            placeholder="active ou inactive"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: clientUserCreatePage.onBack,
              disabled: clientUserCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void clientUserCreatePage.form.handleSubmit(clientUserCreatePage.onSubmit)();
              },
              loading: clientUserCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ClientUserCreatePage;
