import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientUserEditPage } from '@features/client/admin/hooks/useClientUserEditPage';
import type { ClientUserEditFormValues } from '@features/client/admin/schemas/clientUserEditForm.schema';

const ClientUserEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const clientUserEditPage = useClientUserEditPage(id ?? '');

  if (clientUserEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando usuário" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar usuário"
        subtitle="Atualize os dados de acesso do usuário."
        actionLabel="Voltar"
        onAction={clientUserEditPage.onBack}
      />
      {clientUserEditPage.errorMessage ? (
        <AppAlert severity="error">{clientUserEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppTextField
        label="Nome"
        value={clientUserEditPage.entity?.fullName ?? clientUserEditPage.entity?.name ?? ''}
        disabled
      />
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={clientUserEditPage.form}
          onSubmit={clientUserEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<ClientUserEditFormValues> name="email" label="E-mail" />
          <FormTextField<ClientUserEditFormValues>
            name="roleId"
            label="Perfil"
            placeholder="ID do perfil"
          />
          <FormTextField<ClientUserEditFormValues>
            name="status"
            label="Status"
            placeholder="active ou inactive"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: clientUserEditPage.onBack,
              disabled: clientUserEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void clientUserEditPage.form.handleSubmit(clientUserEditPage.onSubmit)();
              },
              loading: clientUserEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ClientUserEditPage;
