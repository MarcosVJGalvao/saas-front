import { describe, expect, it } from 'vitest';
import { classGradeEntryFormSchema } from '@features/client/report-cards/schemas/classGradeEntry/classGradeEntryFormSchema';

const validEntry = {
  studentEnrollmentId: 'enrollment-1',
  gradeValue: '7,50',
  observations: '',
};

const validBase = {
  schoolClassId: 'class-1',
  teacherSubjectId: 'ts-1',
  academicPeriodId: 'period-1',
  assessmentType: 'regular',
  entries: [validEntry],
};

describe('classGradeEntryFormSchema', () => {
  it('valida um formulário completo corretamente', () => {
    const result = classGradeEntryFormSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('rejeita nota acima de 10', () => {
    const result = classGradeEntryFormSchema.safeParse({
      ...validBase,
      entries: [{ ...validEntry, gradeValue: '10,01' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejeita nota negativa', () => {
    const result = classGradeEntryFormSchema.safeParse({
      ...validBase,
      entries: [{ ...validEntry, gradeValue: '-1,00' }],
    });
    expect(result.success).toBe(false);
  });

  it('aceita nota 0,00', () => {
    const result = classGradeEntryFormSchema.safeParse({
      ...validBase,
      entries: [{ ...validEntry, gradeValue: '0,00' }],
    });
    expect(result.success).toBe(true);
  });

  it('aceita nota 0,01', () => {
    const result = classGradeEntryFormSchema.safeParse({
      ...validBase,
      entries: [{ ...validEntry, gradeValue: '0,01' }],
    });
    expect(result.success).toBe(true);
  });

  it('aceita nota 10,00 exata', () => {
    const result = classGradeEntryFormSchema.safeParse({
      ...validBase,
      entries: [{ ...validEntry, gradeValue: '10,00' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejeita sem entries', () => {
    const result = classGradeEntryFormSchema.safeParse({ ...validBase, entries: [] });
    expect(result.success).toBe(false);
  });

  it('rejeita turma vazia', () => {
    const result = classGradeEntryFormSchema.safeParse({ ...validBase, schoolClassId: '' });
    expect(result.success).toBe(false);
  });

  it('rejeita professor/disciplina vazio', () => {
    const result = classGradeEntryFormSchema.safeParse({ ...validBase, teacherSubjectId: '' });
    expect(result.success).toBe(false);
  });

  it('aceita nota com ponto decimal', () => {
    const result = classGradeEntryFormSchema.safeParse({
      ...validBase,
      entries: [{ ...validEntry, gradeValue: '7.50' }],
    });
    expect(result.success).toBe(true);
  });
});
