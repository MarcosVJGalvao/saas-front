import { Controller } from 'react-hook-form';
import { useClientRoleCreatePage } from '@features/client/admin/hooks/useClientRoleCreatePage';
import { PermissionMultiSelect } from '@shared/components/form/PermissionMultiSelect';
import type { ClientRoleCreateFormValues } from '@features/client/admin/schemas/clientRoleCreateForm.schema';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { responsive } from '@theme/utils/responsive';

const ClientRoleCreatePage = () => {
  const page = useClientRoleCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo perfil"
        subtitle="Cadastre perfis de acesso para organizar permissões do tenant."
        actionLabel="Voltar"
        onAction={page.onBack}
      />
      {page.errorMessage ? <AppAlert severity="error">{page.errorMessage}</AppAlert> : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={page.form}
          onSubmit={page.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<ClientRoleCreateFormValues> name="name" label="Nome" />
          <FormTextField<ClientRoleCreateFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <AppStack sx={{ gridColumn: responsive({ xs: '1 / -1' }) }}>
            <Controller
              name="permissionIds"
              control={page.form.control}
              render={({ field, fieldState }) => (
                <PermissionMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  options={page.permissions}
                  loading={page.loadingPermissions}
                />
              )}
            />
          </AppStack>
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: page.onBack,
              disabled: page.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void page.form.handleSubmit(page.onSubmit)();
              },
              loading: page.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ClientRoleCreatePage;
