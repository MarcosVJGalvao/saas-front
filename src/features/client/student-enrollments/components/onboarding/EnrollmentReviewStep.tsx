import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { StudentEnrollmentStepProps } from '@features/client/student-enrollments/components/onboarding/studentEnrollmentOnboarding.types';

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
  <AppCard>
    <AppStack spacing={0.5} sx={{ p: 1.5 }}>
      <AppText variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </AppText>
      <AppText sx={{ fontWeight: 700 }}>{value || '-'}</AppText>
    </AppStack>
  </AppCard>
);

export const EnrollmentReviewStep = ({ value, uiExtras }: StudentEnrollmentStepProps) => (
  <AppStack spacing={1.75}>
    <AppStack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <FactCheckOutlinedIcon color="primary" />
      <AppText variant="h6">Revisão</AppText>
    </AppStack>
    <AppText variant="body2" color="text.secondary">
      Confira os principais dados antes de finalizar a matrícula.
    </AppText>
    <AppGrid container spacing={1.5}>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <ReviewItem
          label="Aluno"
          value={uiExtras.selectedStudentId || value.student?.person.fullName || ''}
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <ReviewItem
          label="Responsável"
          value={value.student?.legalGuardians[0]?.person?.fullName ?? ''}
        />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <ReviewItem label="Ano letivo" value={value.academic.academicYearId} />
      </AppGrid>
      <AppGrid size={{ xs: 12, md: 6 }}>
        <ReviewItem label="Data da matrícula" value={value.academic.enrollmentDate} />
      </AppGrid>
      <AppGrid size={{ xs: 12 }}>
        <ReviewItem label="Observações" value={value.observations ?? ''} />
      </AppGrid>
    </AppGrid>
  </AppStack>
);
