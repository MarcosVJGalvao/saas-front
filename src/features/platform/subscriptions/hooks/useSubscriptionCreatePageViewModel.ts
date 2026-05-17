import { useAppForm } from '@shared/hooks/useAppForm';
import { subscriptionStatusLabelByValue } from '@shared/i18n/pt-BR/enums';
import { useSubscriptionCreatePage } from '@features/platform/subscriptions/hooks/useSubscriptionCreatePage';
import { createSubscriptionSchema } from '@features/platform/subscriptions/schemas/subscriptionsSchemas';

const subscriptionStatusOptions = Object.entries(subscriptionStatusLabelByValue).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export const useSubscriptionCreatePageViewModel = () => {
  const view = useSubscriptionCreatePage();
  const form = useAppForm(createSubscriptionSchema, view.defaultValues);
  const isSubmitting = view.loading || form.formState.isSubmitting;
  const planOptions = view.plans.map((plan) => ({ value: plan.id, label: plan.name }));

  return {
    title: 'Nova Assinatura',
    submitLabel: 'Salvar',
    emptyPlansMessage: 'Nenhum plano ativo disponível.',
    form,
    viewState: planOptions.length === 0 ? 'empty' : 'ready',
    isSubmitting,
    isSubmitDisabled: isSubmitting || planOptions.length === 0,
    handleSubmit: view.handleSubmit,
    subscriptionStatusOptions,
    planOptions,
  };
};
