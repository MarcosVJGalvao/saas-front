import type { UpdateStudentEnrollmentFormValues } from '@features/client/student-enrollments/schemas/studentEnrollmentSchemas';
import type { CreateStudentEnrollmentRequest } from '@features/client/student-enrollments/types/studentEnrollment.types';
import { normalizeOptionalDateToIsoDate } from '@shared/normalizers/dateNormalizers';

const optionalText = (value?: string): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const toStudentEnrollmentUpdatePayload = (
  values: UpdateStudentEnrollmentFormValues,
): Partial<CreateStudentEnrollmentRequest> => ({
  academic: {
    academicYearId: values.academicYearId,
    schoolClassId: optionalText(values.schoolClassId),
    enrollmentDate: normalizeOptionalDateToIsoDate(values.enrollmentDate) ?? values.enrollmentDate,
  },
  enrollmentCode: optionalText(values.enrollmentCode),
  observations: optionalText(values.observations),
});
