import { Controller } from 'react-hook-form';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { subscriptionStatusLabelByValue } from '@shared/i18n/pt-BR/enums';
import { useSubscriptionCreatePage } from '@features/platform/subscriptions/hooks/useSubscriptionCreatePage';
import type { SubscriptionCreateFormValues } from '@features/platform/subscriptions/schemas/subscriptionCreateForm.schema';

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
      {subscriptionCreatePage.plans.length === 0 ? (
        <AppAlert severity="warning">Nenhum plano ativo disponível para assinatura.</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={subscriptionCreatePage.form}
          onSubmit={subscriptionCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<SubscriptionCreateFormValues> name="tenantId" label="Tenant ID" />
          <Controller
            name="planId"
            control={subscriptionCreatePage.form.control}
            render={({ field }) => (
              <AppSelect
                {...field}
                label="Plano"
                options={subscriptionCreatePage.plans.map((plan) => ({
                  value: plan.id,
                  label: plan.name,
                }))}
              />
            )}
          />
          <Controller
            name="status"
            control={subscriptionCreatePage.form.control}
            render={({ field }) => (
              <AppSelect
                {...field}
                label="Status"
                options={Object.entries(subscriptionStatusLabelByValue).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            )}
          />
          <FormTextField<SubscriptionCreateFormValues>
            name="priceAtSubscription"
            label="Preço contratado"
          />
          <FormTextField<SubscriptionCreateFormValues> name="startDate" label="Início" />
          <FormTextField<SubscriptionCreateFormValues> name="renewalDate" label="Renovação" />
          <FormTextField<SubscriptionCreateFormValues> name="trialEndsAt" label="Trial até" />
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
