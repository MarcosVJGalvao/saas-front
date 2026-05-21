import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { AppDatePicker } from '@shared/components/form/AppDatePicker';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { EnrollmentOnboardingField } from '@features/client/student-enrollments/components/onboarding/EnrollmentOnboardingField';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

export const AcademicStep = ({ value, actions, referenceOptions }: StudentEnrollmentStepProps) => (
  <AppStack spacing={1.75}>
    <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <SchoolOutlinedIcon color="primary" />
      <AppText variant="h6">Dados Acadêmicos</AppText>
    </AppStack>
    <AppText variant="body2" color="text.secondary">
      Informe o ano letivo, turma e data oficial da matrícula.
    </AppText>
    {referenceOptions.errorMessage ? (
      <AppText variant="body2" color="error.main">
        {referenceOptions.errorMessage}
      </AppText>
    ) : null}
    <AppGrid container spacing={1.5}>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppSelect
          fullWidth
          size="small"
          label="Ano letivo"
          value={value.academic.academicYearId}
          options={referenceOptions.academicYearOptions}
          disabled={referenceOptions.loading}
          onChange={(event) => actions.updateAcademicYearId(String(event.target.value))}
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppSelect
          fullWidth
          size="small"
          label="Turma"
          value={value.academic.schoolClassId ?? ''}
          options={referenceOptions.schoolClassOptions}
          disabled={referenceOptions.loading}
          helperText="Campo opcional."
          onChange={(event) => actions.updateSchoolClassId(String(event.target.value))}
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <AppDatePicker
          label="Data da matrícula"
          value={value.academic.enrollmentDate}
          onChange={(nextValue) => actions.updateEnrollmentDate(nextValue ?? '')}
          textFieldSlotProps={{ size: 'small' }}
        />
      </AppGrid>
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
