import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { EnrollmentOnboardingField } from '@features/client/student-enrollments/components/onboarding/EnrollmentOnboardingField';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/components/onboarding/studentEnrollmentOnboarding.types';
import { maskCep, maskPhone } from '@shared/masks/inputMasks';

export const ContactsAddressStep = ({ value, uiExtras, actions }: StudentEnrollmentStepProps) => {
  const studentAddress = value.student?.addresses[0];
  const guardianAddress = value.student?.legalGuardians[0]?.addresses?.[0];

  return (
    <AppStack spacing={1.75}>
      <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <ContactPhoneOutlinedIcon color="primary" />
        <AppText variant="h6">Endereço e Contatos</AppText>
      </AppStack>
      <AppGrid container spacing={1.5}>
        <AppGrid size={{ xs: 12 }}>
          <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Contatos do aluno
          </AppText>
        </AppGrid>
        <EnrollmentOnboardingField
          label="E-mail do aluno"
          value={uiExtras.studentEmail}
          onChange={actions.updateStudentEmail}
        />
        <EnrollmentOnboardingField
          label="Telefone do aluno"
          value={maskPhone(uiExtras.studentPhone)}
          onChange={actions.updateStudentPhone}
        />
        <AppGrid size={{ xs: 12 }}>
          <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Endereço do aluno
          </AppText>
        </AppGrid>
        <EnrollmentOnboardingField
          label="CEP"
          value={maskCep(uiExtras.studentCep)}
          onChange={actions.updateStudentCep}
        />
        <EnrollmentOnboardingField
          label="Rua"
          value={studentAddress?.street ?? ''}
          onChange={actions.updateStudentStreet}
        />
        <EnrollmentOnboardingField
          label="Número"
          value={studentAddress?.number ?? ''}
          onChange={actions.updateStudentNumber}
          gridSize={{ xs: 12, md: 3 }}
        />
        <EnrollmentOnboardingField
          label="Complemento"
          value={studentAddress?.complement ?? ''}
          onChange={actions.updateStudentComplement}
          gridSize={{ xs: 12, md: 3 }}
        />
        <EnrollmentOnboardingField
          label="Bairro"
          value={studentAddress?.neighborhood ?? ''}
          onChange={actions.updateStudentNeighborhood}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="Cidade"
          value={studentAddress?.city ?? ''}
          onChange={actions.updateStudentCity}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="Estado"
          value={studentAddress?.state ?? ''}
          onChange={actions.updateStudentState}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="País"
          value={studentAddress?.country ?? 'Brasil'}
          onChange={actions.updateStudentCountry}
        />
        <AppGrid size={{ xs: 12 }}>
          <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Endereço do responsável
          </AppText>
        </AppGrid>
        <EnrollmentOnboardingField
          label="CEP do responsável"
          value={maskCep(uiExtras.guardianCep)}
          onChange={actions.updateGuardianCep}
        />
        <EnrollmentOnboardingField
          label="Rua do responsável"
          value={guardianAddress?.street ?? ''}
          onChange={actions.updateGuardianStreet}
        />
        <EnrollmentOnboardingField
          label="Número"
          value={guardianAddress?.number ?? ''}
          onChange={actions.updateGuardianNumber}
          gridSize={{ xs: 12, md: 3 }}
        />
        <EnrollmentOnboardingField
          label="Complemento"
          value={guardianAddress?.complement ?? ''}
          onChange={actions.updateGuardianComplement}
          gridSize={{ xs: 12, md: 3 }}
        />
        <EnrollmentOnboardingField
          label="Bairro"
          value={guardianAddress?.neighborhood ?? ''}
          onChange={actions.updateGuardianNeighborhood}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="Cidade"
          value={guardianAddress?.city ?? ''}
          onChange={actions.updateGuardianCity}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="Estado"
          value={guardianAddress?.state ?? ''}
          onChange={actions.updateGuardianState}
          gridSize={{ xs: 12, md: 4 }}
        />
        <EnrollmentOnboardingField
          label="País do responsável"
          value={guardianAddress?.country ?? 'Brasil'}
          onChange={actions.updateGuardianCountry}
        />
      </AppGrid>
    </AppStack>
  );
};
