import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { EnrollmentOnboardingField } from '@features/client/student-enrollments/components/onboarding/EnrollmentOnboardingField';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/components/onboarding/studentEnrollmentOnboarding.types';
import {
  toEnrollmentDocumentType,
  toGuardianRelationshipType,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentFieldNormalizers';
import { maskCnpj, maskCpf, maskPhone } from '@shared/masks/inputMasks';

export const GuardiansStep = ({ value, uiExtras, actions }: StudentEnrollmentStepProps) => {
  const guardian = value.student?.legalGuardians[0];
  const person = guardian?.person;
  const documentType = person?.documentType ?? 'CPF';
  const documentNumber = person?.documentNumber ?? '';

  return (
    <AppStack spacing={1.75}>
      <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <FamilyRestroomOutlinedIcon color="primary" />
        <AppText variant="h6">Responsáveis</AppText>
      </AppStack>
      <AppText variant="body2" color="text.secondary">
        Informe o responsável principal. A matrícula exige ao menos um responsável legal.
      </AppText>
      <AppGrid container spacing={1.5}>
        <EnrollmentOnboardingField
          select
          label="Vínculo"
          value={guardian?.relationshipType ?? 'mother'}
          onChange={(nextValue) => {
            const relationshipType = toGuardianRelationshipType(nextValue);
            if (relationshipType) actions.updateGuardianRelationshipType(relationshipType);
          }}
        >
          <AppMenuItem value="mother">Mãe</AppMenuItem>
          <AppMenuItem value="father">Pai</AppMenuItem>
          <AppMenuItem value="legal_guardian">Responsável legal</AppMenuItem>
          <AppMenuItem value="grandparent">Avô/avó</AppMenuItem>
          <AppMenuItem value="other">Outro</AppMenuItem>
        </EnrollmentOnboardingField>
        <EnrollmentOnboardingField
          label="Nome completo"
          value={person?.fullName ?? ''}
          onChange={actions.updateGuardianFullName}
        />
        <EnrollmentOnboardingField
          select
          label="Tipo de documento"
          value={documentType}
          onChange={(nextValue) => {
            const nextDocumentType = toEnrollmentDocumentType(nextValue);
            if (nextDocumentType) actions.updateGuardianDocumentType(nextDocumentType);
          }}
        >
          <AppMenuItem value="CPF">CPF</AppMenuItem>
          <AppMenuItem value="CNPJ">CNPJ</AppMenuItem>
          <AppMenuItem value="RG">RG</AppMenuItem>
          <AppMenuItem value="PASSPORT">Passaporte</AppMenuItem>
          <AppMenuItem value="OTHER">Outro</AppMenuItem>
        </EnrollmentOnboardingField>
        <EnrollmentOnboardingField
          label="Documento"
          value={documentType === 'CPF' ? maskCpf(documentNumber) : maskCnpj(documentNumber)}
          onChange={actions.updateGuardianDocumentNumber}
        />
        <EnrollmentOnboardingField
          label="E-mail"
          value={uiExtras.guardianEmail}
          onChange={actions.updateGuardianEmail}
        />
        <EnrollmentOnboardingField
          label="Telefone"
          value={maskPhone(uiExtras.guardianPhone)}
          onChange={actions.updateGuardianPhone}
        />
      </AppGrid>
    </AppStack>
  );
};
