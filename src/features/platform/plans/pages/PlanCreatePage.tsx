import { Controller } from 'react-hook-form';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppSwitch } from '@shared/components/inputs/AppSwitch';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { billingCycleLabels } from '@shared/i18n/pt-BR/enums';
import { usePlanCreatePage } from '@features/platform/plans/hooks/usePlanCreatePage';
import type { PlanCreateFormValues } from '@features/platform/plans/schemas/planCreateForm.schema';

const billingCycleOptions = [
  { value: 'monthly', label: billingCycleLabels.monthly },
  { value: 'yearly', label: billingCycleLabels.yearly },
];

const PlanCreatePage = () => {
  const planCreatePage = usePlanCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo plano"
        subtitle="Cadastre um plano comercial para novas assinaturas da plataforma."
        actionLabel="Voltar"
        onAction={planCreatePage.onBack}
      />
      {planCreatePage.errorMessage ? (
        <AppAlert severity="error">{planCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={planCreatePage.form}
          onSubmit={planCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<PlanCreateFormValues> name="name" label="Nome" />
          <FormTextField<PlanCreateFormValues> name="description" label="Descrição" />
          <FormTextField<PlanCreateFormValues> name="price" label="Preço" />
          <FormTextField<PlanCreateFormValues> name="currency" label="Moeda" />
          <Controller
            name="billingCycle"
            control={planCreatePage.form.control}
            render={({ field }) => (
              <AppSelect {...field} label="Ciclo de cobrança" options={billingCycleOptions} />
            )}
          />
          <FormTextField<PlanCreateFormValues>
            name="trialDays"
            label="Trial (dias)"
            type="number"
          />
          <Controller
            name="isActive"
            control={planCreatePage.form.control}
            render={({ field }) => (
              <AppSwitch checked={field.value} label="Plano ativo" onChange={field.onChange} />
            )}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: planCreatePage.onBack,
              disabled: planCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void planCreatePage.form.handleSubmit(planCreatePage.onSubmit)();
              },
              loading: planCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default PlanCreatePage;
