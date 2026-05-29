import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { financialCategoryTypeOptions } from '@shared/constants/selectOptions';
import { useFinancialCategoryCreatePage } from '@features/client/financial/hooks/useFinancialCategoryCreatePage';
import type { FinancialCategoryCreateFormValues } from '@features/client/financial/schemas/financialCategoryCreateForm.schema';

const FinancialCategoryCreatePage = () => {
  const financialCategoryCreatePage = useFinancialCategoryCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Nova categoria financeira"
        subtitle="Cadastre categorias para classificar receitas e despesas."
        actionLabel="Voltar"
        onAction={financialCategoryCreatePage.onBack}
      />
      {financialCategoryCreatePage.errorMessage ? (
        <AppAlert severity="error">{financialCategoryCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={financialCategoryCreatePage.form}
          onSubmit={financialCategoryCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<FinancialCategoryCreateFormValues> name="name" label="Nome" />
          <FormTextField<FinancialCategoryCreateFormValues> name="code" label="Código" />
          <FormSelect<FinancialCategoryCreateFormValues>
            name="type"
            label="Tipo"
            options={financialCategoryTypeOptions}
          />
          <FormTextField<FinancialCategoryCreateFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: financialCategoryCreatePage.onBack,
              disabled: financialCategoryCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void financialCategoryCreatePage.form.handleSubmit(
                  financialCategoryCreatePage.onSubmit,
                )();
              },
              loading: financialCategoryCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default FinancialCategoryCreatePage;
