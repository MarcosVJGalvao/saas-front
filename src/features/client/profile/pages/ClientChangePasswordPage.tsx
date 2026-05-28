import { useClientChangePasswordPage } from '@features/client/profile/hooks/useClientChangePasswordPage';
import type { ChangePasswordFormData } from '@features/client/auth/schemas/clientAuthFormSchemas';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';

const ClientChangePasswordPage = () => {
  const page = useClientChangePasswordPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Alterar senha"
        subtitle="Informe sua senha atual e defina uma nova senha."
        actionLabel="Voltar"
        onAction={page.onBack}
      />
      {page.errorMessage ? <AppAlert severity="error">{page.errorMessage}</AppAlert> : null}
      {page.successMessage ? <AppAlert severity="success">{page.successMessage}</AppAlert> : null}
      <AppPaper sx={{ p: 3, maxWidth: 560 }}>
        <AppForm
          form={page.form}
          onSubmit={page.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 1, desktop: 1 }}
        >
          <FormTextField<ChangePasswordFormData>
            name="currentPassword"
            label="Senha atual"
            type="password"
          />
          <FormTextField<ChangePasswordFormData>
            name="newPassword"
            label="Nova senha"
            type="password"
          />
          <FormTextField<ChangePasswordFormData>
            name="confirmPassword"
            label="Confirmar nova senha"
            type="password"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: page.onBack,
              disabled: page.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Alterar senha',
              onClick: () => void page.form.handleSubmit(page.onSubmit)(),
              loading: page.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ClientChangePasswordPage;
