import { useAppForm } from '@shared/hooks/useAppForm';
import { billingCycleLabels } from '@shared/i18n/pt-BR/enums';
import { usePlanCreatePage } from '@features/plans/hooks/usePlanCreatePage';
import { createPlanSchema } from '@features/plans/schemas/plansSchemas';

const billingCycleOptions = Object.entries(billingCycleLabels).map(([value, label]) => ({
  value,
  label,
}));

export const usePlanCreatePageViewModel = () => {
  const view = usePlanCreatePage();
  const form = useAppForm(createPlanSchema, view.defaultValues);
  const isSubmitting = view.loading || form.formState.isSubmitting;

  return {
    title: 'Novo Plano',
    submitLabel: 'Salvar',
    billingCycleOptions,
    form,
    viewState: 'ready',
    isSubmitting,
    isSubmitDisabled: isSubmitting,
    handleSubmit: view.handleSubmit,
  };
};
