import { useState } from 'react';
import { buildStudentEnrollmentSummary } from '@features/client/student-enrollments/normalizers/studentEnrollmentOnboardingSummary';
import {
  initialStudentEnrollmentUiExtras,
  initialStudentEnrollmentValue,
  studentEnrollmentStateFactories,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentOnboardingInitialState';
import { toStudentEnrollmentCreatePayload } from '@features/client/student-enrollments/normalizers/studentEnrollmentForm.normalizer';
import { useStudentEnrollmentOnboardingActions } from '@features/client/student-enrollments/hooks/useStudentEnrollmentOnboardingActions';
import type { CreateStudentEnrollmentRequest } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type {
  StudentEnrollmentOnboardingUiExtras,
  StudentEnrollmentSummaryData,
} from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

export const useStudentEnrollmentOnboardingForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState<CreateStudentEnrollmentRequest>(initialStudentEnrollmentValue);
  const [uiExtras, setUiExtras] = useState<StudentEnrollmentOnboardingUiExtras>(
    initialStudentEnrollmentUiExtras,
  );

  const actions = useStudentEnrollmentOnboardingActions({
    setValue,
    setUiExtras,
    stateFactories: studentEnrollmentStateFactories,
  });

  const payload = toStudentEnrollmentCreatePayload(value, uiExtras);
  const summary: StudentEnrollmentSummaryData = buildStudentEnrollmentSummary(value);
  const isStudentStepComplete =
    uiExtras.selectedStudentId.length > 0 ||
    Boolean(value.student?.person.fullName && value.student.person.documentNumber);
  const isGuardianStepComplete =
    (value.student?.legalGuardians.length ?? 0) > 0 &&
    (value.student?.legalGuardians.every((guardian) => Boolean(guardian.person?.fullName)) ??
      false);
  const isAcademicStepComplete =
    value.academic.academicYearId.length > 0 && value.academic.enrollmentDate.length > 0;

  return {
    activeStep,
    setActiveStep,
    value,
    uiExtras,
    actions,
    summary,
    payload,
    isStudentStepComplete,
    isGuardianStepComplete,
    isAcademicStepComplete,
  };
};
