import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { financialEntityStatusOptions } from '@shared/constants/selectOptions';
import { useFinancialCostCenterCreatePage } from '@features/client/financial/hooks/useFinancialCostCenterCreatePage';
import type { FinancialCostCenterCreateFormValues } from '@features/client/financial/schemas/financialCostCenterCreateForm.schema';

const FinancialCostCenterCreatePage = () => {
  const financialCostCenterCreatePage = useFinancialCostCenterCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo centro de custo"
        subtitle="Cadastre centros de custo para organizar lançamentos financeiros."
        actionLabel="Voltar"
        onAction={financialCostCenterCreatePage.onBack}
      />
      {financialCostCenterCreatePage.errorMessage ? (
        <AppAlert severity="error">{financialCostCenterCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={financialCostCenterCreatePage.form}
          onSubmit={financialCostCenterCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<FinancialCostCenterCreateFormValues> name="name" label="Nome" />
          <FormTextField<FinancialCostCenterCreateFormValues> name="code" label="Código" />
          <FormSelect<FinancialCostCenterCreateFormValues>
            name="status"
            label="Status"
            options={financialEntityStatusOptions}
          />
          <FormTextField<FinancialCostCenterCreateFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: financialCostCenterCreatePage.onBack,
              disabled: financialCostCenterCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void financialCostCenterCreatePage.form.handleSubmit(
                  financialCostCenterCreatePage.onSubmit,
                )();
              },
              loading: financialCostCenterCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default FinancialCostCenterCreatePage;
