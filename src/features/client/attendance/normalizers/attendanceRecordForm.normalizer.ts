import type { AttendanceRecordCreateFormValues } from '@features/client/attendance/schemas/attendanceRecordCreateForm.schema';
import type { AttendanceRecordCreatePayload } from '@features/client/attendance/types/attendance.types';

const toOptionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue ? trimmedValue : undefined;
};

export const attendanceRecordCreateInitialValues: AttendanceRecordCreateFormValues = {
  scheduleId: '',
  attendanceDate: '',
  studentEnrollmentId: '',
  status: 'present',
  observations: '',
};

export const toAttendanceRecordCreatePayload = (
  values: AttendanceRecordCreateFormValues,
): AttendanceRecordCreatePayload => ({
  scheduleId: values.scheduleId.trim(),
  attendanceDate: values.attendanceDate,
  items: [
    {
      studentEnrollmentId: values.studentEnrollmentId.trim(),
      status: values.status,
      observations: toOptionalText(values.observations),
    },
  ],
});
