import { useEffect } from 'react';
import { useAppForm } from '@shared/hooks/useAppForm';
import { billingCycleLabels } from '@shared/i18n/pt-BR/enums';
import { usePlanEditPage } from '@features/platform/plans/hooks/usePlanEditPage';
import { createPlanSchema } from '@features/platform/plans/schemas/plansSchemas';

const billingCycleOptions = Object.entries(billingCycleLabels).map(([value, label]) => ({
  value,
  label,
}));

export const usePlanEditPageViewModel = () => {
  const view = usePlanEditPage();
  const form = useAppForm(createPlanSchema, view.defaultValues);
  const isSubmitting = view.loading || form.formState.isSubmitting;

  useEffect(() => {
    form.reset(view.defaultValues);
  }, [form, view.defaultValues]);

  return {
    title: 'Editar Plano',
    submitLabel: 'Salvar',
    billingCycleOptions,
    form,
    viewState: 'ready',
    isSubmitting,
    isSubmitDisabled: isSubmitting,
    handleSubmit: view.handleSubmit,
  };
};
