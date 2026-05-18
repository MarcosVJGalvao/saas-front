import { afterEach, describe, expect, it, vi } from 'vitest';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';
import { httpClient } from '@shared/services/httpClient';

describe('report card services', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista períodos pelo endpoint correto usando search', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'period-1', name: '1º bimestre' }],
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

    const response = await reportCardService.listAcademicPeriods({
      page: 1,
      limit: 10,
      search: 'bimestre',
    });

    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/academic-periods', {
      params: { page: 1, limit: 10, search: 'bimestre' },
    });
    expect(response.data[0]?.name).toBe('1º bimestre');
  });

  it('busca período pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { id: 'period-1', name: '1º bimestre' },
    });

    const response = await reportCardService.getAcademicPeriodById('period-1');

    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/academic-periods/period-1');
    expect(response.name).toBe('1º bimestre');
  });

  it('lista matriz curricular pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'matrix-1', workload: 80, subject: { id: 'subject-1', name: 'Matemática' } }],
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

    const response = await reportCardService.listGradeSubjects({ page: 1, limit: 10 });

    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/grade-subjects', {
      params: { page: 1, limit: 10 },
    });
    expect(response.data[0]?.subject?.name).toBe('Matemática');
  });

  it('busca vínculo da matriz pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { id: 'matrix-1', workload: 80, subject: { id: 'subject-1', name: 'Matemática' } },
    });

    const response = await reportCardService.getGradeSubjectById('matrix-1');

    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/grade-subjects/matrix-1');
    expect(response.subject?.name).toBe('Matemática');
  });

  it('consulta processamento pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { id: 'processing-1' },
    });

    const response = await reportCardService.getProcessing('processing-1');

    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/processings/processing-1');
    expect(response.id).toBe('processing-1');
  });

  it('remove lançamento pelo endpoint correto', async () => {
    const deleteSpy = vi.spyOn(httpClient, 'delete').mockResolvedValueOnce({
      data: undefined,
    });

    await reportCardService.removeEntry('entry-1');

    expect(deleteSpy).toHaveBeenCalledWith('/api/report-cards/entries/entry-1');
  });
});
