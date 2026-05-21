import { describe, expect, it } from 'vitest';
import {
  toAttendanceRecordCreatePayload,
  toAttendanceRecordItemsFormValues,
} from '@features/client/attendance/normalizers/attendanceRecordForm.normalizer';
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

  it('normaliza o payload de lançamento em lote', () => {
    const payload = toAttendanceRecordCreatePayload({
      scheduleId: ' schedule-1 ',
      attendanceDate: '2026-05-19',
      items: [
        {
          studentEnrollmentId: ' enrollment-1 ',
          status: 'justified',
          observations: ' Consulta médica ',
        },
        {
          studentEnrollmentId: ' enrollment-2 ',
          status: 'present',
          observations: '   ',
        },
      ],
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
        {
          studentEnrollmentId: 'enrollment-2',
          status: 'present',
          observations: undefined,
        },
      ],
    });
  });

  it('prepara os itens iniciais do lançamento em lote', () => {
    const formItems = toAttendanceRecordItemsFormValues([
      {
        id: 'enrollment-1',
        status: 'active',
        enrollmentDate: '2026-01-10',
        student: {
          id: 'student-1',
          person: {
            fullName: 'Ana Souza',
            documentNumber: '12345678900',
          },
        },
      },
    ]);

    expect(formItems).toEqual([
      {
        studentEnrollmentId: 'enrollment-1',
        status: 'present',
        observations: '',
      },
    ]);
  });
});
