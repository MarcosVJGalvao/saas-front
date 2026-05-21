import { describe, expect, it } from 'vitest';
import { buildAttendanceQueryFromFilters } from '@features/client/attendance/hooks/useAttendanceFilters';

describe('attendance filters', () => {
  it('monta query de resumos com os parâmetros aceitos pela API', () => {
    const queryParams = buildAttendanceQueryFromFilters({
      academicYearId: 'year-1',
      schoolClassId: 'class-1',
      subjectId: 'subject-1',
      studentId: '',
      status: '',
      startDate: '2026-05-01',
      endDate: '2026-05-31',
    });

    expect(queryParams).toEqual({
      academicYearId: 'year-1',
      schoolClassId: 'class-1',
      subjectId: 'subject-1',
      studentId: undefined,
      status: undefined,
      startDate: '2026-05-01',
      endDate: '2026-05-31',
      page: 1,
    });
  });
});
