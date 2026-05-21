import type { AttendanceScheduleCreateFormValues } from '@features/client/attendance/schemas/attendanceScheduleCreateForm.schema';
import type { AttendanceScheduleCreatePayload } from '@features/client/attendance/types/attendance.types';

export const attendanceScheduleCreateInitialValues: AttendanceScheduleCreateFormValues = {
  academicYearId: '',
  schoolClassId: '',
  subjectId: '',
  teacherSubjectId: '',
  weekday: '',
  startTime: '',
  endTime: '',
  startDate: '',
  endDate: '',
};

export const toAttendanceScheduleCreatePayload = (
  values: AttendanceScheduleCreateFormValues,
): AttendanceScheduleCreatePayload => ({
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
