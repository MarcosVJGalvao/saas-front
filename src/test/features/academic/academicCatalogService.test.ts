import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  educationLevelService,
  gradeService,
  subjectService,
} from '@features/client/academic/services/academicServices';
import { httpClient } from '@shared/services/httpClient';

describe('academic catalog services', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista níveis de ensino pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'level-1', name: 'Ensino Fundamental', status: 'active' }],
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

    const response = await educationLevelService.list({ page: 1, limit: 10 });

    expect(getSpy).toHaveBeenCalledWith('/api/education-levels', {
      params: { page: 1, limit: 10, sortOrder: 'DESC' },
    });
    expect(response.data[0]?.name).toBe('Ensino Fundamental');
  });

  it('busca série pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { id: 'grade-1', name: '1º ano', status: 'active' },
    });

    const response = await gradeService.getById('grade-1');

    expect(getSpy).toHaveBeenCalledWith('/api/grades/grade-1');
    expect(response.name).toBe('1º ano');
  });

  it('remove disciplina pelo endpoint correto', async () => {
    const deleteSpy = vi.spyOn(httpClient, 'delete').mockResolvedValueOnce({ data: undefined });

    await subjectService.remove('subject-1');

    expect(deleteSpy).toHaveBeenCalledWith('/api/subjects/subject-1');
  });
});
