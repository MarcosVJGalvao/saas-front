import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormDatePicker } from '@shared/components/form/FormDatePicker';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { financialRecordStatusOptions } from '@shared/constants/selectOptions';
import { useAccountsPayableCreatePage } from '@features/client/financial/hooks/useAccountsPayableCreatePage';
import type { AccountsPayableCreateFormValues } from '@features/client/financial/schemas/accountsPayableCreateForm.schema';

const AccountsPayableCreatePage = () => {
  const accountsPayableCreatePage = useAccountsPayableCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Nova conta a pagar"
        subtitle="Cadastre obrigações financeiras, vencimentos e centros de custo."
        actionLabel="Voltar"
        onAction={accountsPayableCreatePage.onBack}
      />
      {accountsPayableCreatePage.errorMessage ? (
        <AppAlert severity="error">{accountsPayableCreatePage.errorMessage}</AppAlert>
      ) : null}
      {accountsPayableCreatePage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {accountsPayableCreatePage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={accountsPayableCreatePage.form}
          onSubmit={accountsPayableCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AccountsPayableCreateFormValues> name="description" label="Descrição" />
          <FormTextField<AccountsPayableCreateFormValues>
            name="amount"
            label="Valor"
            placeholder="R$ 0,00"
          />
          <FormDatePicker<AccountsPayableCreateFormValues> name="dueDate" label="Vencimento" />
          <FormSelect<AccountsPayableCreateFormValues>
            name="status"
            label="Status"
            options={financialRecordStatusOptions}
          />
          <FormSelect<AccountsPayableCreateFormValues>
            name="categoryId"
            label="Categoria"
            options={accountsPayableCreatePage.referenceOptions.categoryOptions}
            disabled={accountsPayableCreatePage.referenceOptions.loading}
          />
          <FormSelect<AccountsPayableCreateFormValues>
            name="costCenterId"
            label="Centro de custo"
            options={accountsPayableCreatePage.referenceOptions.costCenterOptions}
            disabled={accountsPayableCreatePage.referenceOptions.loading}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: accountsPayableCreatePage.onBack,
              disabled: accountsPayableCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void accountsPayableCreatePage.form.handleSubmit(
                  accountsPayableCreatePage.onSubmit,
                )();
              },
              loading: accountsPayableCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default AccountsPayableCreatePage;
