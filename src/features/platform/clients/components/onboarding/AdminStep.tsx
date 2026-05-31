import { AppText } from '@shared/components/data-display/AppText';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import {
  documentTypeOptions,
  genderOptionsWithPlaceholder,
  maritalStatusOptionsWithPlaceholder,
} from '@shared/constants/selectOptions';
import { maskCnpj, maskCpf, maskCurrency } from '@shared/masks/inputMasks';
import { OnboardingField } from '@features/platform/clients/components/onboarding/OnboardingField';
import {
  toOnboardingDocumentType,
  toOnboardingGender,
  toOnboardingMaritalStatus,
} from '@features/platform/clients/normalizers/clientOnboardingFieldNormalizers';
import type { ClientOnboardingStepProps } from '@features/platform/clients/types/clientOnboarding';

export const AdminStep = ({ value, actions }: ClientOnboardingStepProps) => (
  <AppStack spacing={1.5}>
    <AppText variant="h6">Usuário Administrador</AppText>
    <AppGrid container spacing={1.5}>
      <OnboardingField
        label="Nome do Admin"
        value={value.employee.person.fullName}
        onChange={actions.updateAdminFullName}
      />
      <OnboardingField
        label="E-mail do Admin"
        value={value.employee.contacts[0]?.value ?? ''}
        onChange={actions.updateAdminEmail}
      />
      <OnboardingField
        select
        label="Tipo Documento Admin"
        value={value.employee.person.documentType}
        onChange={(nextValue) => {
          const documentType = toOnboardingDocumentType(nextValue);
          if (documentType) {
            actions.updateAdminDocumentType(documentType);
          }
        }}
        options={documentTypeOptions}
      />
      <OnboardingField
        label="Documento do Admin"
        value={
          value.employee.person.documentType === 'CPF'
            ? maskCpf(value.employee.person.documentNumber)
            : maskCnpj(value.employee.person.documentNumber)
        }
        onChange={actions.updateAdminDocumentNumber}
      />
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppDatePicker
          label="Data de Nascimento"
          value={value.employee.person.dateOfBirth ?? ''}
          onChange={(nextValue) => actions.updateAdminDateOfBirth(nextValue ?? '')}
          textFieldSlotProps={{ size: 'small' }}
        />
      </AppGrid>
      <OnboardingField
        label="Naturalidade"
        value={value.employee.person.naturality ?? ''}
        onChange={actions.updateAdminNaturality}
      />
      <OnboardingField
        select
        label="Gênero"
        value={value.employee.person.gender ?? ''}
        onChange={(nextValue) => actions.updateAdminGender(toOnboardingGender(nextValue))}
        options={genderOptionsWithPlaceholder}
      />
      <OnboardingField
        select
        label="Estado Civil"
        value={value.employee.person.maritalStatus ?? ''}
        onChange={(nextValue) =>
          actions.updateAdminMaritalStatus(toOnboardingMaritalStatus(nextValue))
        }
        options={maritalStatusOptionsWithPlaceholder}
      />
      <OnboardingField
        label="Renda Mensal"
        value={maskCurrency(value.employee.person.monthlyIncome ?? '')}
        onChange={actions.updateAdminMonthlyIncome}
      />
      <OnboardingField
        type="password"
        label="Senha Inicial"
        value={value.adminPassword}
        onChange={actions.updateAdminPassword}
      />
    </AppGrid>
  </AppStack>
);
