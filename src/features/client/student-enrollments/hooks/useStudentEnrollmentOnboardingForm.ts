import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { buildStudentEnrollmentSummary } from '@features/client/student-enrollments/normalizers/studentEnrollmentSummary';
import {
  initialStudentEnrollmentUiExtras,
  initialStudentEnrollmentValue,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentInitialState';
import { toStudentEnrollmentPayload } from '@features/client/student-enrollments/normalizers/studentEnrollmentOnboardingNormalizer';
import type {
  CreateStudentEnrollmentRequest,
  StudentEnrollmentOnboardingUiExtras,
  StudentEnrollmentSummaryData,
} from '@features/client/student-enrollments/types/studentEnrollment.types';
import {
  useStudentEnrollmentActions,
  type StudentEnrollmentActions,
} from '@features/client/student-enrollments/hooks/useStudentEnrollmentActions';

export type UseStudentEnrollmentOnboardingFormResult = {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  value: CreateStudentEnrollmentRequest;
  uiExtras: StudentEnrollmentOnboardingUiExtras;
  actions: StudentEnrollmentActions;
  summary: StudentEnrollmentSummaryData;
  payload: CreateStudentEnrollmentRequest;
  isStudentStepComplete: boolean;
  isGuardianStepComplete: boolean;
  isAcademicStepComplete: boolean;
};

const hasStudentData = (
  value: CreateStudentEnrollmentRequest,
  uiExtras: StudentEnrollmentOnboardingUiExtras,
): boolean =>
  uiExtras.selectedStudentId.length > 0 ||
  Boolean(value.student?.person.fullName && value.student.person.documentNumber);

const hasGuardianData = (value: CreateStudentEnrollmentRequest): boolean =>
  Boolean(value.student?.legalGuardians[0]?.person?.fullName);

const hasAcademicData = (value: CreateStudentEnrollmentRequest): boolean =>
  value.academic.academicYearId.length > 0 && value.academic.enrollmentDate.length > 0;

export const useStudentEnrollmentOnboardingForm = (): UseStudentEnrollmentOnboardingFormResult => {
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState<CreateStudentEnrollmentRequest>(initialStudentEnrollmentValue);
  const [uiExtras, setUiExtras] = useState<StudentEnrollmentOnboardingUiExtras>(
    initialStudentEnrollmentUiExtras,
  );
  const actions = useStudentEnrollmentActions({ setValue, setUiExtras });
  const payload = useMemo(() => toStudentEnrollmentPayload(value, uiExtras), [uiExtras, value]);
  const summary = useMemo(() => buildStudentEnrollmentSummary(value), [value]);

  return {
    activeStep,
    setActiveStep,
    value,
    uiExtras,
    actions,
    summary,
    payload,
    isStudentStepComplete: hasStudentData(value, uiExtras),
    isGuardianStepComplete: hasGuardianData(value),
    isAcademicStepComplete: hasAcademicData(value),
  };
};
