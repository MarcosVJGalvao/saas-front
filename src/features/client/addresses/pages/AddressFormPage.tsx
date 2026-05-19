import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAddressFormPageViewModel } from '@features/client/addresses/hooks/useAddressFormPageViewModel';
import type { AddressFormValues } from '@features/client/addresses/schemas/addressFormSchema';

const AddressFormPage = () => {
  const model = useAddressFormPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? 'Editar endereço' : 'Cadastrar endereço'}
        subtitle="Informe logradouro, cidade, estado e CEP."
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando endereço" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<AddressFormValues>
              name="personId"
              label="Pessoa"
              placeholder="ID da pessoa"
            />
            <FormTextField<AddressFormValues> name="street" label="Logradouro" />
            <FormTextField<AddressFormValues> name="number" label="Número" />
            <FormTextField<AddressFormValues> name="complement" label="Complemento" />
            <FormTextField<AddressFormValues> name="neighborhood" label="Bairro" />
            <FormTextField<AddressFormValues> name="city" label="Cidade" />
            <FormTextField<AddressFormValues> name="state" label="Estado" />
            <FormTextField<AddressFormValues> name="zipCode" label="CEP" />
            <FormTextField<AddressFormValues> name="country" label="País" />
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: model.onBack,
                disabled: model.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: model.isEdit ? 'Salvar alterações' : 'Cadastrar',
                onClick: () => {
                  void model.form.handleSubmit(model.onSubmit)();
                },
                loading: model.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      )}
    </AppStack>
  );
};

export default AddressFormPage;
