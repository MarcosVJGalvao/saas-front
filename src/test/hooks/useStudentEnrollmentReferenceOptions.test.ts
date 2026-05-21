import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStudentEnrollmentReferenceOptions } from '@features/client/student-enrollments/hooks/useStudentEnrollmentReferenceOptions';
import {
  academicYearService,
  schoolClassService,
} from '@features/client/academic/services/service';
import { studentService } from '@features/client/students/services/service';

vi.mock('@features/client/academic/services/service', () => ({
  academicYearService: { list: vi.fn() },
  schoolClassService: { list: vi.fn() },
}));

vi.mock('@features/client/students/services/service', () => ({
  studentService: { list: vi.fn() },
}));

const meta = {
  page: 1,
  limit: 10,
  total: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

describe('useStudentEnrollmentReferenceOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega ano letivo, turma e aluno existente', async () => {
    vi.mocked(academicYearService.list).mockResolvedValue({
      data: [{ id: 'year-1', name: '2026', code: '2026', status: 'active' }],
      meta,
    });
    vi.mocked(schoolClassService.list).mockResolvedValue({
      data: [{ id: 'class-1', name: '1º Ano A', code: '1A', status: 'active' }],
      meta,
    });
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

    const { result } = renderHook(() => useStudentEnrollmentReferenceOptions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.academicYearOptions[0]).toEqual({
      value: 'year-1',
      label: '2026 (2026)',
    });
    expect(result.current.schoolClassOptions[1]).toEqual({
      value: 'class-1',
      label: '1º Ano A (1A)',
    });
    expect(result.current.studentOptions[0]).toEqual({
      value: 'student-1',
      label: 'Maria',
    });
  });
});
