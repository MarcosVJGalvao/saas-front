import { useSubscriptionCreatePage } from '@features/platform/subscriptions/hooks/useSubscriptionCreatePage';
import type { SubscriptionCreateFormValues } from '@features/platform/subscriptions/schemas/subscriptionCreateForm.schema';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormDatePicker } from '@shared/components/form/FormDatePicker';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { subscriptionStatusLabelByValue } from '@shared/i18n/pt-BR/enums';

const subscriptionStatusOptions = Object.entries(subscriptionStatusLabelByValue).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

const SubscriptionCreatePage = () => {
  const subscriptionCreatePage = useSubscriptionCreatePage();

  if (subscriptionCreatePage.loadingPlans) {
    return <AppCircularProgress ariaLabel="Carregando planos" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Nova assinatura"
        subtitle="Cadastre uma nova assinatura vinculando tenant, plano e ciclo vigente."
        actionLabel="Voltar"
        onAction={subscriptionCreatePage.onBack}
      />
      {subscriptionCreatePage.errorMessage ? (
        <AppAlert severity="error">{subscriptionCreatePage.errorMessage}</AppAlert>
      ) : null}
      {subscriptionCreatePage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">{subscriptionCreatePage.referenceOptions.errorMessage}</AppAlert>
      ) : null}
      {subscriptionCreatePage.referenceOptions.planOptions.length === 0 ? (
        <AppAlert severity="warning">Nenhum plano ativo disponível para assinatura.</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={subscriptionCreatePage.form}
          onSubmit={subscriptionCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormSelect<SubscriptionCreateFormValues>
            name="tenantId"
            label="Tenant"
            options={subscriptionCreatePage.referenceOptions.tenantOptions}
            disabled={subscriptionCreatePage.referenceOptions.loading}
          />
          <FormSelect<SubscriptionCreateFormValues>
            name="planId"
            label="Plano"
            options={subscriptionCreatePage.referenceOptions.planOptions}
            disabled={subscriptionCreatePage.referenceOptions.loading}
          />
          <FormSelect<SubscriptionCreateFormValues>
            name="status"
            label="Status"
            options={subscriptionStatusOptions}
          />
          <FormTextField<SubscriptionCreateFormValues>
            name="priceAtSubscription"
            label="Preço contratado"
          />
          <FormDatePicker<SubscriptionCreateFormValues> name="startDate" label="Início" />
          <FormDatePicker<SubscriptionCreateFormValues> name="endDate" label="Encerramento" />
          <FormDatePicker<SubscriptionCreateFormValues> name="renewalDate" label="Renovação" />
          <FormDatePicker<SubscriptionCreateFormValues> name="trialEndsAt" label="Trial até" />
          <FormTextField<SubscriptionCreateFormValues>
            name="blockedReason"
            label="Motivo do bloqueio"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: subscriptionCreatePage.onBack,
              disabled: subscriptionCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void subscriptionCreatePage.form.handleSubmit(subscriptionCreatePage.onSubmit)();
              },
              loading: subscriptionCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default SubscriptionCreatePage;
