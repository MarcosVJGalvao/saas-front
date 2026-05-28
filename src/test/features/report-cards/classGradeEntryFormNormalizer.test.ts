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
    expect(payload.entries[0].gradeValue).toBe(7.5);
    expect(payload.entries[1].gradeValue).toBe(10);
    expect(payload.entries[2].gradeValue).toBe(0.01);
  });

  it('remove observações vazias (undefined no payload)', () => {
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

    expect(payload.entries[0].observations).toBeUndefined();
    expect(payload.entries[1].observations).toBeUndefined();
    expect(payload.entries[2].observations).toBe('Nota');
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
    expect(payload.entries[0].studentEnrollmentId).toBe('enrollment-1');
  });
});
