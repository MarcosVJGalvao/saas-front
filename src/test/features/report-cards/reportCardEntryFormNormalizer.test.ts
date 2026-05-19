import { describe, expect, it } from 'vitest';
import { normalizeReportCardEntryPayload } from '@features/client/report-cards/normalizers/reportCardEntryFormNormalizer';

describe('reportCardEntryFormNormalizer', () => {
  it('normaliza o payload do lançamento individual', () => {
    const payload = normalizeReportCardEntryPayload({
      studentEnrollmentId: ' enrollment-1 ',
      subjectId: ' subject-1 ',
      academicPeriodId: ' period-1 ',
      assessmentType: ' Prova ',
      gradeValue: '8,5',
      observations: '',
    });

    expect(payload).toEqual({
      studentEnrollmentId: 'enrollment-1',
      subjectId: 'subject-1',
      academicPeriodId: 'period-1',
      assessmentType: 'Prova',
      gradeValue: 8.5,
      observations: undefined,
    });
  });
});
