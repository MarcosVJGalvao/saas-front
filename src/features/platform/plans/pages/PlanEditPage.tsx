import { useParams } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
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
import { usePlanEditPage } from '@features/platform/plans/hooks/usePlanEditPage';
import type { PlanEditFormValues } from '@features/platform/plans/schemas/planEditForm.schema';

const billingCycleOptions = [
  { value: 'monthly', label: billingCycleLabels.monthly },
  { value: 'yearly', label: billingCycleLabels.yearly },
];

const PlanEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const planEditPage = usePlanEditPage(id ?? '');

  if (planEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando plano" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar plano"
        subtitle="Atualize o preço, o ciclo e a disponibilidade comercial do plano."
        actionLabel="Voltar"
        onAction={planEditPage.onBack}
      />
      {planEditPage.errorMessage ? (
        <AppAlert severity="error">{planEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={planEditPage.form}
          onSubmit={planEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<PlanEditFormValues> name="name" label="Nome" />
          <FormTextField<PlanEditFormValues> name="description" label="Descrição" />
          <FormTextField<PlanEditFormValues> name="price" label="Preço" />
          <FormTextField<PlanEditFormValues> name="currency" label="Moeda" />
          <Controller
            name="billingCycle"
            control={planEditPage.form.control}
            render={({ field }) => (
              <AppSelect {...field} label="Ciclo de cobrança" options={billingCycleOptions} />
            )}
          />
          <FormTextField<PlanEditFormValues> name="trialDays" label="Trial (dias)" type="number" />
          <Controller
            name="isActive"
            control={planEditPage.form.control}
            render={({ field }) => (
              <AppSwitch checked={field.value} label="Plano ativo" onChange={field.onChange} />
            )}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: planEditPage.onBack,
              disabled: planEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void planEditPage.form.handleSubmit(planEditPage.onSubmit)();
              },
              loading: planEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default PlanEditPage;
