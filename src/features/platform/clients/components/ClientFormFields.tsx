import { Controller, useWatch } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import type { CreateClientRequest } from '@features/platform/clients/types/clients';
import { maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';

type ClientFormFieldsProps = {
  form: UseFormReturn<CreateClientRequest>;
  documentTypeOptions: AppSelectOption[];
  clientStatusOptions: AppSelectOption[];
};

export const ClientFormFields = ({
  form,
  documentTypeOptions,
  clientStatusOptions,
}: ClientFormFieldsProps) => {
  const documentType = useWatch({ control: form.control, name: 'documentType' });

  return (
    <>
      <Controller
        name="tradeName"
        control={form.control}
        render={({ field }) => <AppTextField {...field} label="Nome Fantasia" />}
      />
      <Controller
        name="legalName"
        control={form.control}
        render={({ field }) => <AppTextField {...field} label="Razão Social" />}
      />
      <Controller
        name="documentType"
        control={form.control}
        render={({ field }) => (
          <AppSelect {...field} label="Tipo de Documento" options={documentTypeOptions} />
        )}
      />
      <Controller
        name="documentNumber"
        control={form.control}
        render={({ field }) => (
          <AppTextField
            label="Documento"
            value={documentType === 'CPF' ? maskCpf(field.value) : maskCnpj(field.value)}
            onChange={(event) => field.onChange(onlyDigits(event.target.value))}
          />
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => <AppTextField {...field} label="E-mail" />}
      />
      <Controller
        name="phone"
        control={form.control}
        render={({ field }) => (
          <AppTextField
            label="Telefone"
            value={maskPhone(field.value)}
            onChange={(event) => field.onChange(onlyDigits(event.target.value))}
          />
        )}
      />
      <Controller
        name="status"
        control={form.control}
        render={({ field }) => (
          <AppSelect {...field} label="Status" options={clientStatusOptions} />
        )}
      />
    </>
  );
};
