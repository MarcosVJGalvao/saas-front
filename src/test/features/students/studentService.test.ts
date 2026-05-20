import { afterEach, describe, expect, it, vi } from 'vitest';
import { studentService } from '@features/client/students/services/service';
import { httpClient } from '@shared/services/httpClient';

describe('studentService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista alunos com paginação e filtros', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 'student-1',
            status: 'active',
            registrationCode: 'ALU-001',
            person: { fullName: 'Maria Silva', documentNumber: '12345678900' },
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await studentService.list({ page: 1, limit: 10, status: 'active' });

    expect(getSpy).toHaveBeenCalledWith('/api/students', {
      params: { page: 1, limit: 10, status: 'active', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.id).toBe('student-1');
  });

  it('busca detalhes do aluno pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        id: 'student-1',
        status: 'active',
        person: { fullName: 'Maria Silva' },
      },
    });

    const response = await studentService.getById('student-1');

    expect(getSpy).toHaveBeenCalledWith('/api/students/student-1');
    expect(response.person?.fullName).toBe('Maria Silva');
  });
});
