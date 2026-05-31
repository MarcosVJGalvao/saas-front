import { useClientUserCreatePage } from '@features/client/admin/hooks/useClientUserCreatePage';
import type { ClientUserCreateFormValues } from '@features/client/admin/schemas/clientUserCreateForm.schema';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';

const ClientUserCreatePage = () => {
  const clientUserCreatePage = useClientUserCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo usuario"
        subtitle="Selecione o funcionario e configure o acesso ao tenant."
        actionLabel="Voltar"
        onAction={clientUserCreatePage.onBack}
      />
      {clientUserCreatePage.errorMessage ? (
        <AppAlert severity="error">{clientUserCreatePage.errorMessage}</AppAlert>
      ) : null}
      {clientUserCreatePage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">{clientUserCreatePage.referenceOptions.errorMessage}</AppAlert>
      ) : null}
      {!clientUserCreatePage.errorMessage && clientUserCreatePage.emailFieldDisabled ? (
        <AppAlert severity="info">
          O e-mail foi preenchido com o contato do funcionario selecionado.
        </AppAlert>
      ) : null}
      {!clientUserCreatePage.errorMessage &&
      !clientUserCreatePage.emailFieldDisabled &&
      clientUserCreatePage.form.watch('employeeId') ? (
        <AppAlert severity="info">
          Este funcionario nao possui e-mail cadastrado em contatos. Informe um e-mail para o
          usuario.
        </AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={clientUserCreatePage.form}
          onSubmit={clientUserCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormSelect<ClientUserCreateFormValues>
            name="employeeId"
            label="Funcionario"
            options={clientUserCreatePage.employeeOptions}
            disabled={clientUserCreatePage.loadingEmployees}
          />
          <FormTextField<ClientUserCreateFormValues>
            name="email"
            label="E-mail"
            disabled={
              clientUserCreatePage.emailFieldDisabled || clientUserCreatePage.resolvingEmployeeEmail
            }
          />
          <FormSelect<ClientUserCreateFormValues>
            name="roleId"
            label="Perfil"
            options={clientUserCreatePage.referenceOptions.roleOptions}
            disabled={clientUserCreatePage.referenceOptions.loading}
          />
          <FormTextField<ClientUserCreateFormValues>
            name="password"
            label="Senha"
            type="password"
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
