import { AcademicStep } from '@features/client/student-enrollments/components/onboarding/AcademicStep';
import { ContactsAddressStep } from '@features/client/student-enrollments/components/onboarding/ContactsAddressStep';
import { EnrollmentReviewStep } from '@features/client/student-enrollments/components/onboarding/EnrollmentReviewStep';
import { GuardiansStep } from '@features/client/student-enrollments/components/onboarding/GuardiansStep';
import { MedicalInfoStep } from '@features/client/student-enrollments/components/onboarding/MedicalInfoStep';
import { StudentStep } from '@features/client/student-enrollments/components/onboarding/StudentStep';
import type { StudentEnrollmentStepsProps } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

export const StudentEnrollmentSteps = ({
  activeStep,
  value,
  uiExtras,
  actions,
}: StudentEnrollmentStepsProps) => {
  const sharedProps = { value, uiExtras, actions };
  const stepContentByIndex = [
    <StudentStep key="student" {...sharedProps} />,
    <GuardiansStep key="guardians" {...sharedProps} />,
    <ContactsAddressStep key="contacts-address" {...sharedProps} />,
    <MedicalInfoStep key="medical-info" {...sharedProps} />,
    <AcademicStep key="academic" {...sharedProps} />,
    <EnrollmentReviewStep key="review" {...sharedProps} />,
  ];

  return stepContentByIndex[activeStep] ?? stepContentByIndex[0];
};
