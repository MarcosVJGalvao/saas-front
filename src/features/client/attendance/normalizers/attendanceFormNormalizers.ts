import type {
  AttendanceRecordFormValues,
  AttendanceScheduleFormValues,
} from '@features/client/attendance/schemas/attendanceFormSchemas';
import type { MarkAttendancePayload } from '@features/client/attendance/types/attendance.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildAttendanceScheduleInitialValues = (): AttendanceScheduleFormValues => ({
  academicYearId: '',
  schoolClassId: '',
  subjectId: '',
  teacherSubjectId: '',
  weekday: '',
  startTime: '',
  endTime: '',
  startDate: '',
  endDate: '',
});

export const buildAttendanceRecordInitialValues = (): AttendanceRecordFormValues => ({
  scheduleId: '',
  attendanceDate: '',
  studentEnrollmentId: '',
  status: 'present',
  observations: '',
});

export const normalizeAttendanceSchedulePayload = (
  values: AttendanceScheduleFormValues,
): Record<string, unknown> => ({
  academicYearId: values.academicYearId.trim(),
  schoolClassId: values.schoolClassId.trim(),
  subjectId: values.subjectId.trim(),
  teacherSubjectId: values.teacherSubjectId.trim(),
  weekday: values.weekday.trim(),
  startTime: values.startTime,
  endTime: values.endTime,
  startDate: values.startDate,
  endDate: values.endDate,
});

export const normalizeAttendanceRecordPayload = (
  values: AttendanceRecordFormValues,
): MarkAttendancePayload => ({
  scheduleId: values.scheduleId.trim(),
  attendanceDate: values.attendanceDate,
  items: [
    {
      studentEnrollmentId: values.studentEnrollmentId.trim(),
      status: values.status,
      observations: optionalText(values.observations),
    },
  ],
});
