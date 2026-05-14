import { Controller } from 'react-hook-form';
import { AppForm } from '@shared/components/form/AppForm';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { useClientCreatePageViewModel } from '@features/clients/hooks/useClientCreatePageViewModel';

const ClientCreatePage = () => {
  const model = useClientCreatePageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader title={model.title} />
      <AppForm form={model.form} onSubmit={(payload) => void model.handleSubmit(payload)}>
        <Controller
          name="tradeName"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Nome Fantasia" />}
        />
        <Controller
          name="legalName"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Razão Social" />}
        />
        <Controller
          name="documentType"
          control={model.form.control}
          render={({ field }) => (
            <AppSelect {...field} label="Tipo de Documento" options={model.documentTypeOptions} />
          )}
        />
        <Controller
          name="documentNumber"
          control={model.form.control}
          render={({ field }) => (
            <AppTextField
              label="Documento"
              value={
                model.form.watch('documentType') === 'CPF'
                  ? maskCpf(field.value)
                  : maskCnpj(field.value)
              }
              onChange={(event) => field.onChange(onlyDigits(event.target.value))}
            />
          )}
        />
        <Controller
          name="email"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="E-mail" />}
        />
        <Controller
          name="phone"
          control={model.form.control}
          render={({ field }) => <AppTextField {...field} label="Telefone" />}
        />
        <Controller
          name="status"
          control={model.form.control}
          render={({ field }) => (
            <AppSelect {...field} label="Status" options={model.clientStatusOptions} />
          )}
        />
        <AppButton type="submit" disabled={model.isSubmitDisabled}>
          {model.submitLabel}
        </AppButton>
      </AppForm>
    </AppStack>
  );
};

export default ClientCreatePage;
