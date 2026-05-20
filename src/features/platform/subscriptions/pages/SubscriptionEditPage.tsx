import { useParams } from 'react-router-dom';
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
import { useSubscriptionEditPage } from '@features/platform/subscriptions/hooks/useSubscriptionEditPage';
import type { SubscriptionEditFormValues } from '@features/platform/subscriptions/schemas/subscriptionEditForm.schema';

const SubscriptionEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const subscriptionEditPage = useSubscriptionEditPage(id ?? '');

  if (subscriptionEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando assinatura" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar assinatura"
        subtitle="Atualize plano, status, datas de renovação e informações comerciais."
        actionLabel="Voltar"
        onAction={subscriptionEditPage.onBack}
      />
      {subscriptionEditPage.errorMessage ? (
        <AppAlert severity="error">{subscriptionEditPage.errorMessage}</AppAlert>
      ) : null}
      {subscriptionEditPage.plans.length === 0 ? (
        <AppAlert severity="warning">Nenhum plano ativo disponível para assinatura.</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={subscriptionEditPage.form}
          onSubmit={subscriptionEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<SubscriptionEditFormValues> name="tenantId" label="Tenant ID" />
          <Controller
            name="planId"
            control={subscriptionEditPage.form.control}
            render={({ field }) => (
              <AppSelect
                {...field}
                label="Plano"
                options={subscriptionEditPage.plans.map((plan) => ({
                  value: plan.id,
                  label: plan.name,
                }))}
              />
            )}
          />
          <Controller
            name="status"
            control={subscriptionEditPage.form.control}
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
          <FormTextField<SubscriptionEditFormValues>
            name="priceAtSubscription"
            label="Preço contratado"
          />
          <FormTextField<SubscriptionEditFormValues> name="startDate" label="Início" />
          <FormTextField<SubscriptionEditFormValues> name="renewalDate" label="Renovação" />
          <FormTextField<SubscriptionEditFormValues> name="trialEndsAt" label="Trial até" />
          <FormTextField<SubscriptionEditFormValues>
            name="blockedReason"
            label="Motivo do bloqueio"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: subscriptionEditPage.onBack,
              disabled: subscriptionEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void subscriptionEditPage.form.handleSubmit(subscriptionEditPage.onSubmit)();
              },
              loading: subscriptionEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default SubscriptionEditPage;
