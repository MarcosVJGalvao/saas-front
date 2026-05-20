import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { EnrollmentOnboardingField } from '@features/client/student-enrollments/components/onboarding/EnrollmentOnboardingField';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';
import { maskDateInput } from '@shared/masks/inputMasks';

export const AcademicStep = ({ value, actions }: StudentEnrollmentStepProps) => (
  <AppStack spacing={1.75}>
    <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <SchoolOutlinedIcon color="primary" />
      <AppText variant="h6">Dados Acadêmicos</AppText>
    </AppStack>
    <AppText variant="body2" color="text.secondary">
      Informe o ano letivo, turma e data oficial da matrícula.
    </AppText>
    <AppGrid container spacing={1.5}>
      <EnrollmentOnboardingField
        label="ID do ano letivo"
        value={value.academic.academicYearId}
        onChange={actions.updateAcademicYearId}
        helperText="Integração inicial por ID até a listagem acadêmica estar conectada."
      />
      <EnrollmentOnboardingField
        label="ID da turma"
        value={value.academic.schoolClassId ?? ''}
        onChange={actions.updateSchoolClassId}
        helperText="Campo opcional."
      />
      <EnrollmentOnboardingField
        label="Data da matrícula"
        value={maskDateInput(value.academic.enrollmentDate)}
        onChange={actions.updateEnrollmentDate}
      />
      <EnrollmentOnboardingField
        label="Código da matrícula"
        value={value.enrollmentCode ?? ''}
        onChange={actions.updateEnrollmentCode}
      />
      <EnrollmentOnboardingField
        label="Observações"
        value={value.observations ?? ''}
        onChange={actions.updateObservations}
        multiline
        gridSize={{ xs: 12 }}
      />
    </AppGrid>
  </AppStack>
);
