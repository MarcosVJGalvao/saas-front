import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppText } from '@shared/components/data-display/AppText';
import type { CreateClientOnboardingRequest } from '@features/clients/types/clients';
import { maskCnpj, maskCpf, maskCurrency } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { OnboardingStepProps } from '@features/clients/components/onboarding/types';

const getSelectValue = (value: unknown): string => (typeof value === 'string' ? value : '');

const toDocumentType = (
  value: string,
): CreateClientOnboardingRequest['employee']['person']['documentType'] | undefined => {
  switch (value) {
    case 'CPF':
    case 'CNPJ':
    case 'RG':
    case 'PASSPORT':
    case 'OTHER':
      return value;
    default:
      return undefined;
  }
};

const toGender = (
  value: string,
): NonNullable<CreateClientOnboardingRequest['employee']['person']['gender']> | undefined => {
  switch (value) {
    case 'male':
    case 'female':
    case 'other':
    case 'prefer_not_to_say':
      return value;
    default:
      return undefined;
  }
};

const toMaritalStatus = (
  value: string,
):
  | NonNullable<CreateClientOnboardingRequest['employee']['person']['maritalStatus']>
  | undefined => {
  switch (value) {
    case 'single':
    case 'married':
    case 'divorced':
    case 'widowed':
    case 'other':
      return value;
    default:
      return undefined;
  }
};

const maskDateOfBirth = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d{1,4})$/, '$1/$2');
};

export const AdminStep = ({ value, setValue }: OnboardingStepProps) => (
  <AppStack spacing={1.5}>
    <AppText variant="h6">Usuário Administrador</AppText>
    <AppGrid container spacing={1.5}>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Nome do Admin"
          value={value.employee.person.fullName}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: { ...value.employee.person, fullName: event.target.value },
              },
            })
          }
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="E-mail do Admin"
          value={value.employee.contacts[0]?.value ?? ''}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                contacts: [{ type: 'email', value: event.target.value }],
              },
            })
          }
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          select
          label="Tipo Documento Admin"
          value={value.employee.person.documentType}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  documentType:
                    toDocumentType(getSelectValue(event.target.value)) ??
                    value.employee.person.documentType,
                },
              },
            })
          }
        >
          <AppMenuItem value="CPF">CPF</AppMenuItem>
          <AppMenuItem value="CNPJ">CNPJ</AppMenuItem>
          <AppMenuItem value="RG">RG</AppMenuItem>
          <AppMenuItem value="PASSPORT">PASSAPORTE</AppMenuItem>
          <AppMenuItem value="OTHER">OUTRO</AppMenuItem>
        </AppTextField>
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Documento do Admin"
          value={
            value.employee.person.documentType === 'CPF'
              ? maskCpf(value.employee.person.documentNumber)
              : maskCnpj(value.employee.person.documentNumber)
          }
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  documentNumber: onlyDigits(event.target.value),
                },
              },
            })
          }
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Data de Nascimento"
          value={maskDateOfBirth(value.employee.person.dateOfBirth ?? '')}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  dateOfBirth: onlyDigits(event.target.value) || undefined,
                },
              },
            })
          }
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          select
          label="Gênero"
          value={value.employee.person.gender ?? ''}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  gender: toGender(getSelectValue(event.target.value)),
                },
              },
            })
          }
        >
          <AppMenuItem value="">Selecione</AppMenuItem>
          <AppMenuItem value="male">Masculino</AppMenuItem>
          <AppMenuItem value="female">Feminino</AppMenuItem>
          <AppMenuItem value="other">Outro</AppMenuItem>
          <AppMenuItem value="prefer_not_to_say">Prefiro não informar</AppMenuItem>
        </AppTextField>
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          select
          label="Estado Civil"
          value={value.employee.person.maritalStatus ?? ''}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  maritalStatus: toMaritalStatus(getSelectValue(event.target.value)),
                },
              },
            })
          }
        >
          <AppMenuItem value="">Selecione</AppMenuItem>
          <AppMenuItem value="single">Solteiro(a)</AppMenuItem>
          <AppMenuItem value="married">Casado(a)</AppMenuItem>
          <AppMenuItem value="divorced">Divorciado(a)</AppMenuItem>
          <AppMenuItem value="widowed">Viúvo(a)</AppMenuItem>
          <AppMenuItem value="other">Outro</AppMenuItem>
        </AppTextField>
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Renda Mensal"
          value={maskCurrency(value.employee.person.monthlyIncome ?? '')}
          onChange={(event) =>
            setValue({
              ...value,
              employee: {
                ...value.employee,
                person: {
                  ...value.employee.person,
                  monthlyIncome: onlyDigits(event.target.value) || undefined,
                },
              },
            })
          }
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          type="password"
          label="Senha Inicial"
          value={value.adminPassword}
          onChange={(event) => setValue({ ...value, adminPassword: event.target.value })}
        />
      </AppGrid>
    </AppGrid>
  </AppStack>
);
