import { Controller } from 'react-hook-form';
import { AppForm } from '@shared/components/form/AppForm';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSubscriptionCreatePageViewModel } from '@features/platform/subscriptions/hooks/useSubscriptionCreatePageViewModel';

const SubscriptionCreatePage = () => {
  const model = useSubscriptionCreatePageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader title={model.title} />
      {model.viewState === 'empty' ? (
        <AppAlert severity="warning">{model.emptyPlansMessage}</AppAlert>
      ) : null}
      <AppForm form={model.form} onSubmit={(data) => void model.handleSubmit(data)}>
        <Controller
          name="tenantId"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Tenant ID" />}
        />
        <Controller
          name="planId"
          control={model.form.control}
          render={({ field }) => <AppSelect {...field} label="Plano" options={model.planOptions} />}
        />
        <Controller
          name="status"
          control={model.form.control}
          render={({ field }) => (
            <AppSelect {...field} label="Status" options={model.subscriptionStatusOptions} />
          )}
        />
        <Controller
          name="priceAtSubscription"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Preço contratado" />}
        />
        <AppButton type="submit" disabled={model.isSubmitDisabled}>
          {model.submitLabel}
        </AppButton>
      </AppForm>
    </AppStack>
  );
};

export default SubscriptionCreatePage;
