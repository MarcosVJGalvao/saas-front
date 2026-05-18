import type { StudentEnrollmentActions } from '@features/client/student-enrollments/hooks/useStudentEnrollmentActions';
import type {
  CreateStudentEnrollmentRequest,
  StudentEnrollmentOnboardingUiExtras,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

export type StudentEnrollmentStepProps = {
  value: CreateStudentEnrollmentRequest;
  uiExtras: StudentEnrollmentOnboardingUiExtras;
  actions: StudentEnrollmentActions;
};

export type StudentEnrollmentStepsProps = StudentEnrollmentStepProps & {
  activeStep: number;
};
