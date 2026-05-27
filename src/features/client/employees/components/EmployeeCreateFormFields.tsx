import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppText } from '@shared/components/data-display/AppText';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppButton } from '@shared/components/inputs/AppButton';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppStack } from '@shared/components/layout/AppStack';
import { SectionCard } from '@shared/components/layout/SectionCard';
import {
  documentTypeOptions,
  employeeJobTitleOptionsWithPlaceholder,
} from '@shared/constants/selectOptions';
import { maskCep, maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';
import type { EmployeeCreateFormValues } from '@features/client/employees/schemas/employeeCreateForm.schema';

interface EmployeeCreateFormFieldsProps {
  form: UseFormReturn<EmployeeCreateFormValues>;
  addressLookupLoading: boolean;
  onSearchCep: () => void;
}

const employeeCreationModeOptions: AppSelectOption[] = [
  { value: 'existing_person', label: 'Vincular pessoa existente' },
  { value: 'new_person', label: 'Cadastrar pessoa do zero' },
];

const getMaskedDocument = (
  documentType: EmployeeCreateFormValues['documentType'],
  value: string,
): string => {
  if (documentType === 'CPF') {
    return maskCpf(value);
  }

  if (documentType === 'CNPJ') {
    return maskCnpj(value);
  }

  return value;
};

export const EmployeeCreateFormFields = ({
  form,
  addressLookupLoading,
  onSearchCep,
}: EmployeeCreateFormFieldsProps) => {
  const creationMode = form.watch('creationMode');
  const documentType = form.watch('documentType');

  return (
    <AppStack spacing={3} sx={{ gridColumn: '1 / -1' }}>
      <SectionCard
        title="Dados do vínculo"
        subtitle="Escolha como o funcionário será relacionado à pessoa e informe o cargo."
      >
        <AppBox
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <FormSelect<EmployeeCreateFormValues>
            name="creationMode"
            label="Tipo de cadastro"
            options={employeeCreationModeOptions}
          />
          <FormSelect<EmployeeCreateFormValues>
            name="jobTitle"
            label="Cargo"
            options={employeeJobTitleOptionsWithPlaceholder}
          />
          <FormTextField<EmployeeCreateFormValues> name="department" label="Departamento" />
        </AppBox>
      </SectionCard>

      {creationMode === 'existing_person' ? (
        <SectionCard
          title="Pessoa existente"
          subtitle="Informe o identificador da pessoa já cadastrada para vincular ao funcionário."
        >
          <FormTextField<EmployeeCreateFormValues>
            name="personId"
            label="Identificador da pessoa"
            placeholder="person-uuid"
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard
            title="Dados da pessoa"
            subtitle="Informe os dados da pessoa que será criada junto com o funcionário."
          >
            <AppBox
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <FormTextField<EmployeeCreateFormValues> name="fullName" label="Nome completo" />
              <FormSelect<EmployeeCreateFormValues>
                name="documentType"
                label="Tipo de documento"
                options={documentTypeOptions}
              />
              <Controller
                name="documentNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <AppTextField
                    label="Documento"
                    value={getMaskedDocument(documentType, field.value)}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </AppBox>
          </SectionCard>

          <SectionCard
            title="Endereço"
            subtitle="Digite o CEP para preencher automaticamente e ajuste os campos se necessário."
            actions={
              <AppButton
                variant="outlined"
                onClick={onSearchCep}
                disabled={addressLookupLoading}
                startIcon={
                  addressLookupLoading ? (
                    <AppCircularProgress size={16} ariaLabel="Buscando CEP" sx={{ py: 0 }} />
                  ) : undefined
                }
              >
                Buscar CEP
              </AppButton>
            }
          >
            <AppBox
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <Controller
                name="zipCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <AppTextField
                    label="CEP"
                    value={maskCep(field.value)}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <FormTextField<EmployeeCreateFormValues> name="street" label="Logradouro" />
              <FormTextField<EmployeeCreateFormValues> name="number" label="Número" />
              <FormTextField<EmployeeCreateFormValues> name="complement" label="Complemento" />
              <FormTextField<EmployeeCreateFormValues> name="neighborhood" label="Bairro" />
              <FormTextField<EmployeeCreateFormValues> name="city" label="Cidade" />
              <FormTextField<EmployeeCreateFormValues> name="state" label="UF" />
              <FormTextField<EmployeeCreateFormValues> name="country" label="País" />
            </AppBox>
          </SectionCard>

          <SectionCard title="Contatos" subtitle="Informe ao menos um contato para a nova pessoa.">
            <AppBox
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <AppTextField
                    label="E-mail"
                    value={field.value ?? ''}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <AppTextField
                    label="Telefone"
                    value={maskPhone(field.value ?? '')}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </AppBox>
            <AppText variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Você pode revisar e editar todos os campos preenchidos pelo CEP antes de salvar.
            </AppText>
          </SectionCard>
        </>
      )}
    </AppStack>
  );
};
