import { useParams } from 'react-router-dom';
import { useSubscriptionEditPage } from '@features/platform/subscriptions/hooks/useSubscriptionEditPage';
import type { SubscriptionEditFormValues } from '@features/platform/subscriptions/schemas/subscriptionEditForm.schema';
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
      {subscriptionEditPage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">{subscriptionEditPage.referenceOptions.errorMessage}</AppAlert>
      ) : null}
      {subscriptionEditPage.referenceOptions.planOptions.length === 0 ? (
        <AppAlert severity="warning">Nenhum plano ativo disponível para assinatura.</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={subscriptionEditPage.form}
          onSubmit={subscriptionEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormSelect<SubscriptionEditFormValues>
            name="tenantId"
            label="Tenant"
            options={subscriptionEditPage.referenceOptions.tenantOptions}
            disabled={subscriptionEditPage.referenceOptions.loading}
          />
          <FormSelect<SubscriptionEditFormValues>
            name="planId"
            label="Plano"
            options={subscriptionEditPage.referenceOptions.planOptions}
            disabled={subscriptionEditPage.referenceOptions.loading}
          />
          <FormSelect<SubscriptionEditFormValues>
            name="status"
            label="Status"
            options={subscriptionStatusOptions}
          />
          <FormTextField<SubscriptionEditFormValues>
            name="priceAtSubscription"
            label="Preço contratado"
          />
          <FormDatePicker<SubscriptionEditFormValues> name="startDate" label="Início" />
          <FormDatePicker<SubscriptionEditFormValues> name="endDate" label="Encerramento" />
          <FormDatePicker<SubscriptionEditFormValues> name="renewalDate" label="Renovação" />
          <FormDatePicker<SubscriptionEditFormValues> name="trialEndsAt" label="Trial até" />
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
