import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormDatePicker } from '@shared/components/form/FormDatePicker';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { financialRecordStatusOptions } from '@features/client/financial/constants/financialFormOptions';
import { useAccountsReceivableCreatePage } from '@features/client/financial/hooks/useAccountsReceivableCreatePage';
import type { AccountsReceivableCreateFormValues } from '@features/client/financial/schemas/accountsReceivableCreateForm.schema';

const AccountsReceivableCreatePage = () => {
  const accountsReceivableCreatePage = useAccountsReceivableCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Nova conta a receber"
        subtitle="Cadastre recebíveis vinculados a alunos, vencimentos e categorias."
        actionLabel="Voltar"
        onAction={accountsReceivableCreatePage.onBack}
      />
      {accountsReceivableCreatePage.errorMessage ? (
        <AppAlert severity="error">{accountsReceivableCreatePage.errorMessage}</AppAlert>
      ) : null}
      {accountsReceivableCreatePage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {accountsReceivableCreatePage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={accountsReceivableCreatePage.form}
          onSubmit={accountsReceivableCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AccountsReceivableCreateFormValues> name="description" label="Descrição" />
          <FormTextField<AccountsReceivableCreateFormValues>
            name="amount"
            label="Valor"
            placeholder="R$ 0,00"
          />
          <FormDatePicker<AccountsReceivableCreateFormValues> name="dueDate" label="Vencimento" />
          <FormSelect<AccountsReceivableCreateFormValues>
            name="status"
            label="Status"
            options={financialRecordStatusOptions}
          />
          <FormSelect<AccountsReceivableCreateFormValues>
            name="categoryId"
            label="Categoria"
            options={accountsReceivableCreatePage.referenceOptions.categoryOptions}
            disabled={accountsReceivableCreatePage.referenceOptions.loading}
          />
          <FormSelect<AccountsReceivableCreateFormValues>
            name="costCenterId"
            label="Centro de custo"
            options={accountsReceivableCreatePage.referenceOptions.costCenterOptions}
            disabled={accountsReceivableCreatePage.referenceOptions.loading}
          />
          <FormSelect<AccountsReceivableCreateFormValues>
            name="studentId"
            label="Aluno"
            options={accountsReceivableCreatePage.referenceOptions.studentOptions}
            disabled={accountsReceivableCreatePage.referenceOptions.loading}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: accountsReceivableCreatePage.onBack,
              disabled: accountsReceivableCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void accountsReceivableCreatePage.form.handleSubmit(
                  accountsReceivableCreatePage.onSubmit,
                )();
              },
              loading: accountsReceivableCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default AccountsReceivableCreatePage;
