import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { EnrollmentOnboardingField } from '@features/client/student-enrollments/components/onboarding/EnrollmentOnboardingField';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';
import { bloodTypeOptions } from '@shared/constants/selectOptions';
import { maskPhone } from '@shared/masks/inputMasks';

export const MedicalInfoStep = ({ value, actions }: StudentEnrollmentStepProps) => {
  const medicalInfo = value.student?.medicalInfo;

  return (
    <AppStack spacing={1.75}>
      <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <HealthAndSafetyOutlinedIcon color="primary" />
        <AppText variant="h6">Informações Médicas</AppText>
      </AppStack>
      <AppText variant="body2" color="text.secondary">
        Registre alertas importantes para atendimento e acompanhamento do aluno.
      </AppText>
      <AppGrid container spacing={1.5}>
        <EnrollmentOnboardingField
          select
          label="Tipo sanguíneo"
          value={medicalInfo?.bloodType ?? ''}
          onChange={actions.updateMedicalBloodType}
          options={bloodTypeOptions}
          gridSize={{ xs: 12, md: 3 }}
        />
        <EnrollmentOnboardingField
          label="Nome do contato de emergência"
          value={medicalInfo?.emergencyContactName ?? ''}
          onChange={actions.updateMedicalEmergencyContactName}
          gridSize={{ xs: 12, md: 6 }}
        />
        <EnrollmentOnboardingField
          label="Telefone de emergência"
          value={maskPhone(medicalInfo?.emergencyContactPhone ?? '')}
          onChange={actions.updateMedicalEmergencyContactPhone}
          gridSize={{ xs: 12, md: 3 }}
        />
        <EnrollmentOnboardingField
          label="Alergias"
          value={medicalInfo?.allergies ?? ''}
          onChange={actions.updateMedicalAllergies}
          multiline
          gridSize={{ xs: 12 }}
        />
        <EnrollmentOnboardingField
          label="Doenças crônicas"
          value={medicalInfo?.chronicDiseases ?? ''}
          onChange={actions.updateMedicalChronicDiseases}
          multiline
          gridSize={{ xs: 12 }}
        />
        <EnrollmentOnboardingField
          label="Medicamentos"
          value={medicalInfo?.medications ?? ''}
          onChange={actions.updateMedicalMedications}
          multiline
          gridSize={{ xs: 12 }}
        />
        <EnrollmentOnboardingField
          label="Observações médicas"
          value={medicalInfo?.notes ?? ''}
          onChange={actions.updateMedicalNotes}
          multiline
          gridSize={{ xs: 12 }}
        />
      </AppGrid>
    </AppStack>
  );
};
