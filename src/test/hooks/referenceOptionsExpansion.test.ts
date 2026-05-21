import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAcademicReferenceOptions } from '@features/client/academic/hooks/useAcademicReferenceOptions';
import { useAttendanceReferenceOptions } from '@features/client/attendance/hooks/useAttendanceReferenceOptions';
import { useFinancialReferenceOptions } from '@features/client/financial/hooks/useFinancialReferenceOptions';
import { useReportCardReferenceOptions } from '@features/client/report-cards/hooks/useReportCardReferenceOptions';
import {
  academicYearService,
  educationLevelService,
  gradeService,
  schoolClassService,
  subjectService,
  teacherSubjectService,
} from '@features/client/academic/services/service';
import { attendanceSchedulesService } from '@features/client/attendance/services/service';
import { employeeService } from '@features/client/employees/services/service';
import {
  financialCategoriesService,
  financialCostCentersService,
} from '@features/client/financial/services/service';
import { reportCardService } from '@features/client/report-cards/services/service';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import { studentService } from '@features/client/students/services/service';

vi.mock('@features/client/employees/services/service', () => ({
  employeeService: { list: vi.fn() },
}));

vi.mock('@features/client/academic/services/service', () => ({
  academicYearService: { list: vi.fn() },
  educationLevelService: { list: vi.fn() },
  gradeService: { list: vi.fn() },
  schoolClassService: { list: vi.fn() },
  subjectService: { list: vi.fn() },
  teacherSubjectService: { list: vi.fn() },
}));

vi.mock('@features/client/attendance/services/service', () => ({
  attendanceSchedulesService: { list: vi.fn() },
}));

vi.mock('@features/client/student-enrollments/services/service', () => ({
  studentEnrollmentService: { list: vi.fn() },
}));

vi.mock('@features/client/students/services/service', () => ({
  studentService: { list: vi.fn() },
}));

vi.mock('@features/client/financial/services/service', () => ({
  financialCategoriesService: { list: vi.fn() },
  financialCostCentersService: { list: vi.fn() },
}));

vi.mock('@features/client/report-cards/services/service', () => ({
  reportCardService: { listAcademicPeriods: vi.fn() },
}));

const meta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const emptyResponse = { data: [], meta };

describe('reference options expansion hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(academicYearService.list).mockResolvedValue(emptyResponse);
    vi.mocked(educationLevelService.list).mockResolvedValue(emptyResponse);
    vi.mocked(gradeService.list).mockResolvedValue(emptyResponse);
    vi.mocked(schoolClassService.list).mockResolvedValue(emptyResponse);
    vi.mocked(subjectService.list).mockResolvedValue(emptyResponse);
    vi.mocked(teacherSubjectService.list).mockResolvedValue(emptyResponse);
    vi.mocked(employeeService.list).mockResolvedValue(emptyResponse);
    vi.mocked(attendanceSchedulesService.list).mockResolvedValue(emptyResponse);
    vi.mocked(studentEnrollmentService.list).mockResolvedValue(emptyResponse);
    vi.mocked(studentService.list).mockResolvedValue(emptyResponse);
    vi.mocked(financialCategoriesService.list).mockResolvedValue(emptyResponse);
    vi.mocked(financialCostCentersService.list).mockResolvedValue(emptyResponse);
    vi.mocked(reportCardService.listAcademicPeriods).mockResolvedValue(emptyResponse);
  });

  it('expõe professores no hook acadêmico', async () => {
    vi.mocked(employeeService.list).mockResolvedValue({
      data: [
        {
          id: 'teacher-1',
          jobTitle: 'Professor',
          person: { id: 'person-1', fullName: 'João' },
        },
      ],
      meta,
    });

    const { result } = renderHook(() =>
      useAcademicReferenceOptions({ includeTeachers: true, includeSubjects: true }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.teacherOptions).toEqual([{ value: 'teacher-1', label: 'João' }]);
  });

  it('expõe alunos em frequência', async () => {
    vi.mocked(studentService.list).mockResolvedValue({
      data: [
        {
          id: 'student-1',
          registrationCode: 'ALU-1',
          status: 'active',
          person: { fullName: 'Maria', documentNumber: '123' },
        },
      ],
      meta,
    });

    const { result } = renderHook(() => useAttendanceReferenceOptions({ includeStudents: true }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.studentOptions[0]).toEqual({ value: 'student-1', label: 'Maria' });
  });

  it('expõe matrícula e turma em financeiro', async () => {
    vi.mocked(studentEnrollmentService.list).mockResolvedValue({
      data: [
        {
          id: 'enrollment-1',
          enrollmentCode: 'MAT-1',
          status: 'active',
          enrollmentDate: '2026-05-20',
          student: {
            id: 'student-2',
            person: { fullName: 'Pedro', documentNumber: '123' },
          },
        },
      ],
      meta,
    });
    vi.mocked(schoolClassService.list).mockResolvedValue({
      data: [{ id: 'class-1', name: 'Turma A', code: 'A', status: 'active' }],
      meta,
    });

    const { result } = renderHook(() =>
      useFinancialReferenceOptions({
        includeStudentEnrollments: true,
        includeSchoolClasses: true,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.studentEnrollmentOptions[1]).toEqual({
      value: 'enrollment-1',
      label: 'Pedro',
    });
    expect(result.current.schoolClassOptions[1]).toEqual({
      value: 'class-1',
      label: 'Turma A (A)',
    });
  });

  it('expõe aluno, matrícula e turma no boletim', async () => {
    vi.mocked(studentService.list).mockResolvedValue({
      data: [
        {
          id: 'student-1',
          registrationCode: 'ALU-1',
          status: 'active',
          person: { fullName: 'Maria', documentNumber: '123' },
        },
      ],
      meta,
    });
    vi.mocked(studentEnrollmentService.list).mockResolvedValue({
      data: [
        {
          id: 'enrollment-1',
          enrollmentCode: 'MAT-1',
          status: 'active',
          enrollmentDate: '2026-05-20',
          student: {
            id: 'student-2',
            person: { fullName: 'Pedro', documentNumber: '123' },
          },
        },
      ],
      meta,
    });
    vi.mocked(schoolClassService.list).mockResolvedValue({
      data: [{ id: 'class-1', name: 'Turma A', code: 'A', status: 'active' }],
      meta,
    });

    const { result } = renderHook(() =>
      useReportCardReferenceOptions({
        includeStudents: true,
        includeStudentEnrollments: true,
        includeSchoolClasses: true,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.studentOptions[0]).toEqual({ value: 'student-1', label: 'Maria' });
    expect(result.current.studentEnrollmentOptions[0]).toEqual({
      value: 'enrollment-1',
      label: 'Pedro',
    });
    expect(result.current.schoolClassOptions[0]).toEqual({
      value: 'class-1',
      label: 'Turma A (A)',
    });
  });
});
