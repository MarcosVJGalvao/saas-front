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
import { useAccountsReceivableEditPage } from '@features/client/financial/hooks/useAccountsReceivableEditPage';
import type { AccountsReceivableEditFormValues } from '@features/client/financial/schemas/accountsReceivableEditForm.schema';

const AccountsReceivableEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const accountsReceivableEditPage = useAccountsReceivableEditPage(id ?? '');

  if (accountsReceivableEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando conta a receber" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar conta a receber"
        subtitle="Atualize os dados financeiros do recebível."
        actionLabel="Voltar"
        onAction={accountsReceivableEditPage.onBack}
      />
      {accountsReceivableEditPage.errorMessage ? (
        <AppAlert severity="error">{accountsReceivableEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppTextField
        label="Descrição"
        value={
          accountsReceivableEditPage.entity?.description ??
          accountsReceivableEditPage.entity?.name ??
          ''
        }
        disabled
      />
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={accountsReceivableEditPage.form}
          onSubmit={accountsReceivableEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AccountsReceivableEditFormValues>
            name="amount"
            label="Valor"
            placeholder="R$ 0,00"
          />
          <FormTextField<AccountsReceivableEditFormValues>
            name="dueDate"
            label="Vencimento"
            type="date"
          />
          <FormTextField<AccountsReceivableEditFormValues>
            name="status"
            label="Status"
            placeholder="open, paid, received..."
          />
          <FormTextField<AccountsReceivableEditFormValues>
            name="categoryId"
            label="Categoria"
            placeholder="ID da categoria"
          />
          <FormTextField<AccountsReceivableEditFormValues>
            name="costCenterId"
            label="Centro de custo"
            placeholder="ID do centro de custo"
          />
          <FormTextField<AccountsReceivableEditFormValues>
            name="studentId"
            label="Aluno"
            placeholder="ID do aluno"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: accountsReceivableEditPage.onBack,
              disabled: accountsReceivableEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void accountsReceivableEditPage.form.handleSubmit(
                  accountsReceivableEditPage.onSubmit,
                )();
              },
              loading: accountsReceivableEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default AccountsReceivableEditPage;
