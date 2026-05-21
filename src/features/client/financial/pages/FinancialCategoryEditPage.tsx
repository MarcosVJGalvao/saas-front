import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import {
  financialCategoryTypeOptions,
  financialEntityStatusOptions,
} from '@features/client/financial/constants/financialFormOptions';
import { useFinancialCategoryEditPage } from '@features/client/financial/hooks/useFinancialCategoryEditPage';
import type { FinancialCategoryEditFormValues } from '@features/client/financial/schemas/financialCategoryEditForm.schema';

const FinancialCategoryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const financialCategoryEditPage = useFinancialCategoryEditPage(id ?? '');

  if (financialCategoryEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando categoria financeira" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar categoria financeira"
        subtitle="Atualize os dados cadastrais da categoria financeira."
        actionLabel="Voltar"
        onAction={financialCategoryEditPage.onBack}
      />
      {financialCategoryEditPage.errorMessage ? (
        <AppAlert severity="error">{financialCategoryEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppTextField label="Nome" value={financialCategoryEditPage.entity?.name ?? ''} disabled />
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={financialCategoryEditPage.form}
          onSubmit={financialCategoryEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<FinancialCategoryEditFormValues> name="code" label="Código" />
          <FormSelect<FinancialCategoryEditFormValues>
            name="type"
            label="Tipo"
            options={financialCategoryTypeOptions}
          />
          <FormSelect<FinancialCategoryEditFormValues>
            name="status"
            label="Status"
            options={financialEntityStatusOptions}
          />
          <FormTextField<FinancialCategoryEditFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: financialCategoryEditPage.onBack,
              disabled: financialCategoryEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void financialCategoryEditPage.form.handleSubmit(
                  financialCategoryEditPage.onSubmit,
                )();
              },
              loading: financialCategoryEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default FinancialCategoryEditPage;
