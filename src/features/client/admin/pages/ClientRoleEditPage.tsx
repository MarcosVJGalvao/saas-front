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
import { useClientRoleEditPage } from '@features/client/admin/hooks/useClientRoleEditPage';
import type { ClientRoleEditFormValues } from '@features/client/admin/schemas/clientRoleEditForm.schema';

const ClientRoleEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const clientRoleEditPage = useClientRoleEditPage(id ?? '');

  if (clientRoleEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando perfil" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar perfil"
        subtitle="Atualize os dados cadastrais do perfil."
        actionLabel="Voltar"
        onAction={clientRoleEditPage.onBack}
      />
      {clientRoleEditPage.errorMessage ? (
        <AppAlert severity="error">{clientRoleEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppTextField label="Nome" value={clientRoleEditPage.entity?.name ?? ''} disabled />
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={clientRoleEditPage.form}
          onSubmit={clientRoleEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<ClientRoleEditFormValues>
            name="status"
            label="Status"
            placeholder="active ou inactive"
          />
          <FormTextField<ClientRoleEditFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: clientRoleEditPage.onBack,
              disabled: clientRoleEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void clientRoleEditPage.form.handleSubmit(clientRoleEditPage.onSubmit)();
              },
              loading: clientRoleEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ClientRoleEditPage;
