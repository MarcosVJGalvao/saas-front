import { describe, expect, it } from 'vitest';
import { toClassGradeEntryPayload } from '@features/client/report-cards/normalizers/classGradeEntryFormNormalizer';

describe('classGradeEntryFormNormalizer', () => {
  it('converte gradeValue de string com vírgula para número', () => {
    const payload = toClassGradeEntryPayload({
      schoolClassId: 'class-1',
      teacherSubjectId: 'ts-1',
      academicPeriodId: 'period-1',
      assessmentType: 'regular',
      entries: [
        { studentEnrollmentId: 'enrollment-1', gradeValue: '7,5', observations: 'Ótimo' },
        { studentEnrollmentId: 'enrollment-2', gradeValue: '10,00', observations: '' },
        { studentEnrollmentId: 'enrollment-3', gradeValue: '0,01', observations: undefined },
      ],
    });

    expect(payload.teacherSubjectId).toBe('ts-1');
    expect(payload.academicPeriodId).toBe('period-1');
    expect(payload.assessmentType).toBe('regular');
    expect(payload.entries).toMatchObject([
      { studentEnrollmentId: 'enrollment-1', gradeValue: 7.5, observations: 'Ótimo' },
      { studentEnrollmentId: 'enrollment-2', gradeValue: 10 },
      { studentEnrollmentId: 'enrollment-3', gradeValue: 0.01 },
    ]);
  });

  it('remove observações vazias (propriedade ausente no payload)', () => {
    const payload = toClassGradeEntryPayload({
      schoolClassId: 'class-1',
      teacherSubjectId: 'ts-1',
      academicPeriodId: 'period-1',
      assessmentType: 'regular',
      entries: [
        { studentEnrollmentId: 'enrollment-1', gradeValue: '5,00', observations: '' },
        { studentEnrollmentId: 'enrollment-2', gradeValue: '5,00', observations: '  ' },
        { studentEnrollmentId: 'enrollment-3', gradeValue: '5,00', observations: 'Nota' },
      ],
    });

    expect(payload.entries).toMatchObject([
      { studentEnrollmentId: 'enrollment-1', gradeValue: 5 },
      { studentEnrollmentId: 'enrollment-2', gradeValue: 5 },
      { studentEnrollmentId: 'enrollment-3', gradeValue: 5, observations: 'Nota' },
    ]);
    expect('observations' in (payload.entries[0] ?? {})).toBe(false);
    expect('observations' in (payload.entries[1] ?? {})).toBe(false);
  });

  it('faz trim nos IDs antes de enviar', () => {
    const payload = toClassGradeEntryPayload({
      schoolClassId: 'class-1',
      teacherSubjectId: ' ts-1 ',
      academicPeriodId: ' period-1 ',
      assessmentType: ' regular ',
      entries: [{ studentEnrollmentId: ' enrollment-1 ', gradeValue: '3,00', observations: '' }],
    });

    expect(payload.teacherSubjectId).toBe('ts-1');
    expect(payload.academicPeriodId).toBe('period-1');
    expect(payload.assessmentType).toBe('regular');
    expect(payload.entries).toMatchObject([{ studentEnrollmentId: 'enrollment-1' }]);
  });
});
