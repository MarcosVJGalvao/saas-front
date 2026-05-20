import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import {
  toOnboardingDocumentType,
  toOnboardingGender,
  toOnboardingMaritalStatus,
} from '@features/platform/clients/normalizers/clientOnboardingFieldNormalizers';
import { maskCnpj, maskCpf, maskCurrency, maskDateInput } from '@shared/masks/inputMasks';
import { OnboardingField } from '@features/platform/clients/components/onboarding/OnboardingField';
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
      >
        <AppMenuItem value="CPF">CPF</AppMenuItem>
        <AppMenuItem value="CNPJ">CNPJ</AppMenuItem>
        <AppMenuItem value="RG">RG</AppMenuItem>
        <AppMenuItem value="PASSPORT">PASSAPORTE</AppMenuItem>
        <AppMenuItem value="OTHER">OUTRO</AppMenuItem>
      </OnboardingField>
      <OnboardingField
        label="Documento do Admin"
        value={
          value.employee.person.documentType === 'CPF'
            ? maskCpf(value.employee.person.documentNumber)
            : maskCnpj(value.employee.person.documentNumber)
        }
        onChange={actions.updateAdminDocumentNumber}
      />
      <OnboardingField
        label="Data de Nascimento"
        value={maskDateInput(value.employee.person.dateOfBirth ?? '')}
        onChange={actions.updateAdminDateOfBirth}
      />
      <OnboardingField
        select
        label="Gênero"
        value={value.employee.person.gender ?? ''}
        onChange={(nextValue) => actions.updateAdminGender(toOnboardingGender(nextValue))}
      >
        <AppMenuItem value="">Selecione</AppMenuItem>
        <AppMenuItem value="male">Masculino</AppMenuItem>
        <AppMenuItem value="female">Feminino</AppMenuItem>
        <AppMenuItem value="other">Outro</AppMenuItem>
        <AppMenuItem value="prefer_not_to_say">Prefiro não informar</AppMenuItem>
      </OnboardingField>
      <OnboardingField
        select
        label="Estado Civil"
        value={value.employee.person.maritalStatus ?? ''}
        onChange={(nextValue) =>
          actions.updateAdminMaritalStatus(toOnboardingMaritalStatus(nextValue))
        }
      >
        <AppMenuItem value="">Selecione</AppMenuItem>
        <AppMenuItem value="single">Solteiro(a)</AppMenuItem>
        <AppMenuItem value="married">Casado(a)</AppMenuItem>
        <AppMenuItem value="divorced">Divorciado(a)</AppMenuItem>
        <AppMenuItem value="widowed">Viúvo(a)</AppMenuItem>
        <AppMenuItem value="other">Outro</AppMenuItem>
      </OnboardingField>
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
