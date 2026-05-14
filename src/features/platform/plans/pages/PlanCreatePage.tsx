import { Controller } from 'react-hook-form';
import { AppForm } from '@shared/components/form/AppForm';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppSwitch } from '@shared/components/inputs/AppSwitch';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { usePlanCreatePageViewModel } from '@features/platform/plans/hooks/usePlanCreatePageViewModel';

const PlanCreatePage = () => {
  const model = usePlanCreatePageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader title={model.title} />
      <AppForm form={model.form} onSubmit={(data) => void model.handleSubmit(data)}>
        <Controller
          name="name"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Nome" />}
        />
        <Controller
          name="description"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Descrição" />}
        />
        <Controller
          name="price"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Preço" />}
        />
        <Controller
          name="currency"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Moeda" />}
        />
        <Controller
          name="billingCycle"
          control={model.form.control}
          render={({ field }) => (
            <AppSelect {...field} label="Ciclo" options={model.billingCycleOptions} />
          )}
        />
        <Controller
          name="trialDays"
          control={model.form.control}
          render={({ field }) => (
            <AppTextField
              {...field}
              type="number"
              label="Trial (dias)"
              onChange={(event) => field.onChange(Number(event.target.value))}
            />
          )}
        />
        <Controller
          name="isActive"
          control={model.form.control}
          render={({ field }) => (
            <AppSwitch
              checked={Boolean(field.value)}
              label="Ativo"
              onChange={(checked) => field.onChange(checked)}
            />
          )}
        />
        <AppButton type="submit" disabled={model.isSubmitDisabled}>
          {model.submitLabel}
        </AppButton>
      </AppForm>
    </AppStack>
  );
};

export default PlanCreatePage;
