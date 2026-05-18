import type { UpdateStudentEnrollmentFormValues } from '@features/client/student-enrollments/schemas/studentEnrollmentSchemas';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';

export const emptyStudentEnrollmentEditValues: UpdateStudentEnrollmentFormValues = {
  academicYearId: '',
  schoolClassId: '',
  enrollmentDate: '',
  enrollmentCode: '',
  observations: '',
};

export const toStudentEnrollmentEditValues = (
  enrollment: StudentEnrollment,
): UpdateStudentEnrollmentFormValues => ({
  academicYearId: enrollment.academicYear?.id ?? '',
  schoolClassId: enrollment.schoolClass?.id ?? '',
  enrollmentDate: enrollment.enrollmentDate,
  enrollmentCode: enrollment.enrollmentCode ?? '',
  observations: enrollment.observations ?? '',
});
