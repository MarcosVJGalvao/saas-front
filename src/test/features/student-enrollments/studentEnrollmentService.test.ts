import { afterEach, describe, expect, it, vi } from 'vitest';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import { httpClient } from '@shared/services/httpClient';
import type { CreateStudentEnrollmentRequest } from '@features/client/student-enrollments/types/studentEnrollment.types';

describe('studentEnrollmentService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envia criação para POST /api/student-enrollments', async () => {
    const payload: CreateStudentEnrollmentRequest = {
      studentId: 'student-1',
      academic: {
        academicYearId: 'year-1',
        enrollmentDate: '2026-05-17',
      },
    };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: {
        id: 'enrollment-1',
        status: 'active',
        enrollmentDate: '2026-05-17',
      },
    });

    const response = await studentEnrollmentService.create(payload);

    expect(postSpy).toHaveBeenCalledWith('/api/student-enrollments', payload);
    expect(response.id).toBe('enrollment-1');
  });

  it('envia atualização para PATCH /api/student-enrollments/:id', async () => {
    const payload: Partial<CreateStudentEnrollmentRequest> = {
      academic: {
        academicYearId: 'year-2',
        schoolClassId: 'class-1',
        enrollmentDate: '2026-05-18',
      },
      observations: 'Atualização pedagógica.',
    };
    const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValueOnce({
      data: {
        id: 'enrollment-1',
        status: 'active',
        enrollmentDate: '2026-05-18',
      },
    });

    const response = await studentEnrollmentService.update('enrollment-1', payload);

    expect(patchSpy).toHaveBeenCalledWith('/api/student-enrollments/enrollment-1', payload);
    expect(response.enrollmentDate).toBe('2026-05-18');
  });

  it('remove matrícula pelo endpoint correto', async () => {
    const deleteSpy = vi.spyOn(httpClient, 'delete').mockResolvedValueOnce({ data: undefined });

    await studentEnrollmentService.remove('enrollment-1');

    expect(deleteSpy).toHaveBeenCalledWith('/api/student-enrollments/enrollment-1');
  });

  it('baixa contrato de matrícula como blob', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({ data: blob });

    const response = await studentEnrollmentService.downloadEnrollmentContract('enrollment-1');

    expect(postSpy).toHaveBeenCalledWith(
      '/api/student-enrollments/enrollment-1/enrollment-contract',
      undefined,
      { responseType: 'blob', timeout: 80000 },
    );
    expect(response).toBe(blob);
  });
});
