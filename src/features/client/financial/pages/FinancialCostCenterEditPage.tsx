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
import { financialEntityStatusOptions } from '@shared/constants/selectOptions';
import { useFinancialCostCenterEditPage } from '@features/client/financial/hooks/useFinancialCostCenterEditPage';
import type { FinancialCostCenterEditFormValues } from '@features/client/financial/schemas/financialCostCenterEditForm.schema';

const FinancialCostCenterEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const financialCostCenterEditPage = useFinancialCostCenterEditPage(id ?? '');

  if (financialCostCenterEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando centro de custo" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar centro de custo"
        subtitle="Atualize os dados cadastrais do centro de custo."
        actionLabel="Voltar"
        onAction={financialCostCenterEditPage.onBack}
      />
      {financialCostCenterEditPage.errorMessage ? (
        <AppAlert severity="error">{financialCostCenterEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppTextField label="Nome" value={financialCostCenterEditPage.entity?.name ?? ''} disabled />
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={financialCostCenterEditPage.form}
          onSubmit={financialCostCenterEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<FinancialCostCenterEditFormValues> name="code" label="Código" />
          <FormSelect<FinancialCostCenterEditFormValues>
            name="status"
            label="Status"
            options={financialEntityStatusOptions}
          />
          <FormTextField<FinancialCostCenterEditFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: financialCostCenterEditPage.onBack,
              disabled: financialCostCenterEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void financialCostCenterEditPage.form.handleSubmit(
                  financialCostCenterEditPage.onSubmit,
                )();
              },
              loading: financialCostCenterEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default FinancialCostCenterEditPage;
