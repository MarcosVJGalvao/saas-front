import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAdminEntityFormPageViewModel } from '@features/client/admin/hooks/useAdminEntityFormPageViewModel';
import type { AdminEntityFormValues } from '@features/client/admin/schemas/adminEntityFormSchema';
import type { ClientAdminEntity } from '@features/client/admin/types/admin.types';

type AdminEntityFormService = {
  getById: (id: string) => Promise<ClientAdminEntity>;
  create: (payload: Record<string, unknown>) => Promise<ClientAdminEntity>;
  update: (id: string, payload: Record<string, unknown>) => Promise<ClientAdminEntity>;
};

type AdminEntityFormPageProps = {
  title: string;
  editTitle: string;
  subtitle: string;
  backPath: string;
  service: AdminEntityFormService;
  loadErrorMessage: string;
  submitErrorMessage: string;
  includeUserFields?: boolean | undefined;
};

export const AdminEntityFormPage = ({
  title,
  editTitle,
  subtitle,
  backPath,
  service,
  loadErrorMessage,
  submitErrorMessage,
  includeUserFields = false,
}: AdminEntityFormPageProps) => {
  const model = useAdminEntityFormPageViewModel({
    service,
    backPath,
    includeUserFields,
    loadErrorMessage,
    submitErrorMessage,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? editTitle : title}
        subtitle={subtitle}
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando formulário" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<AdminEntityFormValues> name="name" label="Nome" />
            {includeUserFields ? (
              <FormTextField<AdminEntityFormValues> name="email" label="E-mail" />
            ) : null}
            {includeUserFields ? (
              <FormTextField<AdminEntityFormValues>
                name="roleId"
                label="Perfil"
                placeholder="ID do perfil"
              />
            ) : null}
            <FormTextField<AdminEntityFormValues>
              name="status"
              label="Status"
              placeholder="active ou inactive"
            />
            {!includeUserFields ? (
              <FormTextField<AdminEntityFormValues>
                name="description"
                label="Descrição"
                placeholder="Descrição opcional"
              />
            ) : null}
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: model.onBack,
                disabled: model.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: model.isEdit ? 'Salvar alterações' : 'Cadastrar',
                onClick: () => {
                  void model.form.handleSubmit(model.onSubmit)();
                },
                loading: model.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      )}
    </AppStack>
  );
};
