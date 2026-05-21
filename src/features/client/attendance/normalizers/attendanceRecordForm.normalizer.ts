import type { AttendanceRecordCreateFormValues } from '@features/client/attendance/schemas/attendanceRecordCreateForm.schema';
import type { AttendanceRecordCreatePayload } from '@features/client/attendance/types/attendance.types';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';

const toOptionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue ? trimmedValue : undefined;
};

export const attendanceRecordCreateInitialValues: AttendanceRecordCreateFormValues = {
  scheduleId: '',
  attendanceDate: '',
  items: [],
};

export const toAttendanceRecordItemsFormValues = (
  enrollments: StudentEnrollment[],
): AttendanceRecordCreateFormValues['items'] =>
  enrollments.map((enrollment) => ({
    studentEnrollmentId: enrollment.id,
    status: 'present',
    observations: '',
  }));

export const toAttendanceRecordCreatePayload = (
  values: AttendanceRecordCreateFormValues,
): AttendanceRecordCreatePayload => ({
  scheduleId: values.scheduleId.trim(),
  attendanceDate: values.attendanceDate,
  items: values.items.map((item) => ({
    studentEnrollmentId: item.studentEnrollmentId.trim(),
    status: item.status,
    observations: toOptionalText(item.observations),
  })),
});
