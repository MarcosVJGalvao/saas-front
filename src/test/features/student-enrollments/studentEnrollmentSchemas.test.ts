import { describe, expect, it } from 'vitest';
import { createStudentEnrollmentSchema } from '@features/client/student-enrollments/schemas/studentEnrollmentSchemas';

describe('createStudentEnrollmentSchema', () => {
  it('aceita matrícula com aluno existente e dados acadêmicos obrigatórios', () => {
    const result = createStudentEnrollmentSchema.safeParse({
      studentId: 'student-1',
      academic: {
        academicYearId: 'year-1',
        enrollmentDate: '2026-05-17',
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejeita matrícula sem aluno e sem studentId', () => {
    const result = createStudentEnrollmentSchema.safeParse({
      academic: {
        academicYearId: 'year-1',
        enrollmentDate: '2026-05-17',
      },
    });

    expect(result.success).toBe(false);
  });
});
