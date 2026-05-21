import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppForm } from '@shared/components/form/AppForm';
import { FormDatePicker } from '@shared/components/form/FormDatePicker';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { financialRecordStatusOptions } from '@shared/constants/selectOptions';
import { useAccountsPayableEditPage } from '@features/client/financial/hooks/useAccountsPayableEditPage';
import type { AccountsPayableEditFormValues } from '@features/client/financial/schemas/accountsPayableEditForm.schema';

const AccountsPayableEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const accountsPayableEditPage = useAccountsPayableEditPage(id ?? '');

  if (accountsPayableEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando conta a pagar" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar conta a pagar"
        subtitle="Atualize os dados financeiros da obrigação."
        actionLabel="Voltar"
        onAction={accountsPayableEditPage.onBack}
      />
      {accountsPayableEditPage.errorMessage ? (
        <AppAlert severity="error">{accountsPayableEditPage.errorMessage}</AppAlert>
      ) : null}
      {accountsPayableEditPage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {accountsPayableEditPage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
      <AppTextField
        label="Descrição"
        value={
          accountsPayableEditPage.entity?.description ?? accountsPayableEditPage.entity?.name ?? ''
        }
        disabled
      />
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={accountsPayableEditPage.form}
          onSubmit={accountsPayableEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AccountsPayableEditFormValues>
            name="amount"
            label="Valor"
            placeholder="R$ 0,00"
          />
          <FormDatePicker<AccountsPayableEditFormValues> name="dueDate" label="Vencimento" />
          <FormSelect<AccountsPayableEditFormValues>
            name="status"
            label="Status"
            options={financialRecordStatusOptions}
          />
          <FormSelect<AccountsPayableEditFormValues>
            name="categoryId"
            label="Categoria"
            options={accountsPayableEditPage.referenceOptions.categoryOptions}
            disabled={accountsPayableEditPage.referenceOptions.loading}
          />
          <FormSelect<AccountsPayableEditFormValues>
            name="costCenterId"
            label="Centro de custo"
            options={accountsPayableEditPage.referenceOptions.costCenterOptions}
            disabled={accountsPayableEditPage.referenceOptions.loading}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: accountsPayableEditPage.onBack,
              disabled: accountsPayableEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void accountsPayableEditPage.form.handleSubmit(accountsPayableEditPage.onSubmit)();
              },
              loading: accountsPayableEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default AccountsPayableEditPage;
