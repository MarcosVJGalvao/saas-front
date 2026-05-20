import { describe, expect, it } from 'vitest';
import { toAttendanceRecordCreatePayload } from '@features/client/attendance/normalizers/attendanceRecordForm.normalizer';
import { toAttendanceScheduleCreatePayload } from '@features/client/attendance/normalizers/attendanceScheduleForm.normalizer';

describe('attendance form normalizers', () => {
  it('normaliza o payload de horário', () => {
    const payload = toAttendanceScheduleCreatePayload({
      academicYearId: ' year-1 ',
      schoolClassId: ' class-1 ',
      subjectId: ' subject-1 ',
      teacherSubjectId: ' teacher-subject-1 ',
      weekday: ' Segunda-feira ',
      startTime: '08:00',
      endTime: '09:00',
      startDate: '2026-02-01',
      endDate: '2026-12-15',
    });

    expect(payload).toEqual({
      academicYearId: 'year-1',
      schoolClassId: 'class-1',
      subjectId: 'subject-1',
      teacherSubjectId: 'teacher-subject-1',
      weekday: 'Segunda-feira',
      startTime: '08:00',
      endTime: '09:00',
      startDate: '2026-02-01',
      endDate: '2026-12-15',
    });
  });

  it('normaliza o payload de lançamento', () => {
    const payload = toAttendanceRecordCreatePayload({
      scheduleId: ' schedule-1 ',
      attendanceDate: '2026-05-19',
      studentEnrollmentId: ' enrollment-1 ',
      status: 'justified',
      observations: ' Consulta médica ',
    });

    expect(payload).toEqual({
      scheduleId: 'schedule-1',
      attendanceDate: '2026-05-19',
      items: [
        {
          studentEnrollmentId: 'enrollment-1',
          status: 'justified',
          observations: 'Consulta médica',
        },
      ],
    });
  });
});
