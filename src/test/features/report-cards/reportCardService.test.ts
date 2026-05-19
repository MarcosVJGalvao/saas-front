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

  it('cria período pelo endpoint correto', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'period-1', name: '1º bimestre' },
    });

    await reportCardService.createAcademicPeriod({ name: '1º bimestre' });

    expect(postSpy).toHaveBeenCalledWith('/api/report-cards/academic-periods', {
      name: '1º bimestre',
    });
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

  it('cria matriz curricular pelo endpoint correto', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'matrix-1', subjectId: 'subject-1' },
    });

    await reportCardService.createGradeSubject({ subjectId: 'subject-1' });

    expect(postSpy).toHaveBeenCalledWith('/api/report-cards/grade-subjects', {
      subjectId: 'subject-1',
    });
  });

  it('busca vínculo da matriz pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { id: 'matrix-1', workload: 80, subject: { id: 'subject-1', name: 'Matemática' } },
    });

    const response = await reportCardService.getGradeSubjectById('matrix-1');

    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/grade-subjects/matrix-1');
    expect(response.subject?.name).toBe('Matemática');
  });

  it('cria lançamentos em lote pelo endpoint correto', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'bulk-1' },
    });

    await reportCardService.createClassEntriesBulk('class-1', {
      subjectId: 'subject-1',
      entries: [],
    });

    expect(postSpy).toHaveBeenCalledWith('/api/report-cards/classes/class-1/entries/bulk', {
      subjectId: 'subject-1',
      entries: [],
    });
  });

  it('atualiza e remove lançamentos em lote pelos endpoints corretos', async () => {
    const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValueOnce({
      data: { id: 'bulk-1' },
    });
    const deleteSpy = vi.spyOn(httpClient, 'delete').mockResolvedValueOnce({
      data: undefined,
    });

    await reportCardService.updateClassEntriesBulk('class-1', {
      subjectId: 'subject-1',
      entries: [{ id: 'entry-1', gradeValue: 8 }],
    });
    await reportCardService.removeClassEntriesBulk('class-1', {
      ids: ['entry-1'],
    });

    expect(patchSpy).toHaveBeenCalledWith('/api/report-cards/classes/class-1/entries/bulk', {
      subjectId: 'subject-1',
      entries: [{ id: 'entry-1', gradeValue: 8 }],
    });
    expect(deleteSpy).toHaveBeenCalledWith('/api/report-cards/classes/class-1/entries/bulk', {
      data: { ids: ['entry-1'] },
    });
  });

  it('consulta boletim de aluno, turma, resumo e dashboards', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValue({
      data: { id: 'report-1' },
    });

    await reportCardService.getStudentReportCard('student-1', { academicYearId: 'year-1' });
    await reportCardService.getClassReportCard('class-1', { academicYearId: 'year-1' });
    await reportCardService.getClassSummary('class-1', { academicYearId: 'year-1' });
    await reportCardService.getDashboardSummary({ academicYearId: 'year-1' });
    await reportCardService.getDashboardCharts({ academicYearId: 'year-1' });

    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/students/student-1', {
      params: { academicYearId: 'year-1' },
    });
    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/classes/class-1', {
      params: { academicYearId: 'year-1' },
    });
    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/classes/class-1/summary', {
      params: { academicYearId: 'year-1' },
    });
    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/dashboard/summary', {
      params: { academicYearId: 'year-1' },
    });
    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/dashboard/charts', {
      params: { academicYearId: 'year-1' },
    });
  });

  it('consulta processamento pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { id: 'processing-1' },
    });

    const response = await reportCardService.getProcessing('processing-1');

    expect(getSpy).toHaveBeenCalledWith('/api/report-cards/processings/processing-1');
    expect(response.id).toBe('processing-1');
  });

  it('reenvia item de processamento pelo endpoint correto', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'processing-1' },
    });

    await reportCardService.resendProcessingStudent('processing-1', 'enrollment-1');

    expect(postSpy).toHaveBeenCalledWith(
      '/api/report-cards/processings/processing-1/resend/students/enrollment-1',
    );
  });

  it('reenvia falhas de processamento pelo endpoint correto', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'processing-1' },
    });

    await reportCardService.resendFailedProcessing('processing-1');

    expect(postSpy).toHaveBeenCalledWith(
      '/api/report-cards/processings/processing-1/resend-failed',
    );
  });

  it('finaliza e reabre período pelo endpoint correto', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
      data: { id: 'workflow-1' },
    });

    await reportCardService.finalizePeriod('class-1', 'period-1');
    await reportCardService.reopenPeriod('class-1', 'period-1');

    expect(postSpy).toHaveBeenCalledWith(
      '/api/report-cards/classes/class-1/periods/period-1/finalize',
    );
    expect(postSpy).toHaveBeenCalledWith(
      '/api/report-cards/classes/class-1/periods/period-1/reopen',
    );
  });

  it('remove lançamento pelo endpoint correto', async () => {
    const deleteSpy = vi.spyOn(httpClient, 'delete').mockResolvedValueOnce({
      data: undefined,
    });

    await reportCardService.removeEntry('entry-1');

    expect(deleteSpy).toHaveBeenCalledWith('/api/report-cards/entries/entry-1');
  });
});
