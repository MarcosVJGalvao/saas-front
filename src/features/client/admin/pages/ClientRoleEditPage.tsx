import { useParams } from 'react-router-dom';
import { useClientRoleEditPage } from '@features/client/admin/hooks/useClientRoleEditPage';
import type { ClientRoleEditFormValues } from '@features/client/admin/schemas/clientRoleEditForm.schema';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { activeInactiveStatusOptions } from '@shared/constants/selectOptions';

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
          <FormSelect<ClientRoleEditFormValues>
            name="status"
            label="Status"
            options={activeInactiveStatusOptions}
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
