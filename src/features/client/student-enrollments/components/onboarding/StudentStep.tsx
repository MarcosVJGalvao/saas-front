import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { EnrollmentOnboardingField } from '@features/client/student-enrollments/components/onboarding/EnrollmentOnboardingField';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/components/onboarding/studentEnrollmentOnboarding.types';
import {
  toEnrollmentDocumentType,
  toEnrollmentGender,
  toEnrollmentMaritalStatus,
  toEnrollmentNationality,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentFieldNormalizers';
import { maskCnpj, maskCpf, maskDateInput } from '@shared/masks/inputMasks';

export const StudentStep = ({ value, uiExtras, actions }: StudentEnrollmentStepProps) => {
  const person = value.student?.person;
  const documentType = person?.documentType ?? 'CPF';
  const documentNumber = person?.documentNumber ?? '';

  return (
    <AppStack spacing={1.75}>
      <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <PersonOutlineOutlinedIcon color="primary" />
        <AppText variant="h6">Aluno</AppText>
      </AppStack>
      <AppText variant="body2" color="text.secondary">
        Selecione um aluno existente ou preencha os dados para criar o aluno junto com a matrícula.
      </AppText>
      <AppGrid container spacing={1.5}>
        <EnrollmentOnboardingField
          label="ID do aluno existente"
          value={uiExtras.selectedStudentId}
          onChange={actions.updateSelectedStudentId}
          helperText="Preencha somente se o aluno já existir."
        />
        <EnrollmentOnboardingField
          label="Código de matrícula do aluno"
          value={value.student?.registrationCode ?? ''}
          onChange={actions.updateStudentRegistrationCode}
        />
        <EnrollmentOnboardingField
          label="Nome completo"
          value={person?.fullName ?? ''}
          onChange={actions.updateStudentFullName}
        />
        <EnrollmentOnboardingField
          select
          label="Tipo de documento"
          value={documentType}
          onChange={(nextValue) => {
            const nextDocumentType = toEnrollmentDocumentType(nextValue);
            if (nextDocumentType) actions.updateStudentDocumentType(nextDocumentType);
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
          onChange={actions.updateStudentDocumentNumber}
        />
        <EnrollmentOnboardingField
          label="Data de nascimento"
          value={maskDateInput(person?.dateOfBirth ?? '')}
          onChange={actions.updateStudentDateOfBirth}
        />
        <EnrollmentOnboardingField
          select
          label="Gênero"
          value={person?.gender ?? ''}
          onChange={(nextValue) => actions.updateStudentGender(toEnrollmentGender(nextValue))}
        >
          <AppMenuItem value="">Selecione</AppMenuItem>
          <AppMenuItem value="male">Masculino</AppMenuItem>
          <AppMenuItem value="female">Feminino</AppMenuItem>
          <AppMenuItem value="other">Outro</AppMenuItem>
          <AppMenuItem value="prefer_not_to_say">Prefiro não informar</AppMenuItem>
        </EnrollmentOnboardingField>
        <EnrollmentOnboardingField
          select
          label="Estado civil"
          value={person?.maritalStatus ?? ''}
          onChange={(nextValue) =>
            actions.updateStudentMaritalStatus(toEnrollmentMaritalStatus(nextValue))
          }
        >
          <AppMenuItem value="">Selecione</AppMenuItem>
          <AppMenuItem value="single">Solteiro(a)</AppMenuItem>
          <AppMenuItem value="married">Casado(a)</AppMenuItem>
          <AppMenuItem value="divorced">Divorciado(a)</AppMenuItem>
          <AppMenuItem value="widowed">Viúvo(a)</AppMenuItem>
          <AppMenuItem value="other">Outro</AppMenuItem>
        </EnrollmentOnboardingField>
        <EnrollmentOnboardingField
          select
          label="Nacionalidade"
          value={person?.nationality ?? 'brazilian'}
          onChange={(nextValue) =>
            actions.updateStudentNationality(toEnrollmentNationality(nextValue))
          }
        >
          <AppMenuItem value="brazilian">Brasileira</AppMenuItem>
          <AppMenuItem value="foreign">Estrangeira</AppMenuItem>
          <AppMenuItem value="other">Outra</AppMenuItem>
        </EnrollmentOnboardingField>
      </AppGrid>
    </AppStack>
  );
};
