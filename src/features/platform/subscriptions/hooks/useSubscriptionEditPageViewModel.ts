import { useEffect } from 'react';
import { useAppForm } from '@shared/hooks/useAppForm';
import { subscriptionStatusLabelByValue } from '@shared/i18n/pt-BR/enums';
import { useSubscriptionEditPage } from '@features/platform/subscriptions/hooks/useSubscriptionEditPage';
import { createSubscriptionSchema } from '@features/platform/subscriptions/schemas/subscriptionsSchemas';

const subscriptionStatusOptions = Object.entries(subscriptionStatusLabelByValue).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export const useSubscriptionEditPageViewModel = () => {
  const view = useSubscriptionEditPage();
  const form = useAppForm(createSubscriptionSchema, view.defaultValues);
  const isSubmitting = view.loading || form.formState.isSubmitting;
  const planOptions = view.plans.map((plan) => ({ value: plan.id, label: plan.name }));
  const hasTenantId = view.tenantId.length > 0;

  useEffect(() => {
    form.reset(view.defaultValues);
  }, [form, view.defaultValues]);

  return {
    title: 'Editar Assinatura',
    submitLabel: 'Salvar',
    missingTenantMessage: 'tenantId é obrigatório.',
    emptyPlansMessage: 'Nenhum plano ativo disponível.',
    form,
    viewState: !hasTenantId ? 'error' : planOptions.length === 0 ? 'empty' : 'ready',
    isSubmitting,
    isSubmitDisabled: isSubmitting || planOptions.length === 0,
    handleSubmit: view.handleSubmit,
    hasTenantId,
    subscriptionStatusOptions,
    planOptions,
  };
};
