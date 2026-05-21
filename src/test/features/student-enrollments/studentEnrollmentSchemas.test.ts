import { describe, expect, it } from 'vitest';
import { studentEnrollmentCreateFormSchema } from '@features/client/student-enrollments/schemas/studentEnrollmentCreateForm.schema';

describe('studentEnrollmentCreateFormSchema', () => {
  it('aceita matrícula com aluno existente e dados acadêmicos obrigatórios', () => {
    const result = studentEnrollmentCreateFormSchema.safeParse({
      studentId: 'student-1',
      academic: {
        academicYearId: 'year-1',
        enrollmentDate: '2026-05-17',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejeita matrícula sem aluno e sem studentId', () => {
    const result = studentEnrollmentCreateFormSchema.safeParse({
      academic: {
        academicYearId: 'year-1',
        enrollmentDate: '2026-05-17',
      },
    });

    expect(result.success).toBe(false);
  });
});
