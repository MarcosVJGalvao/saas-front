import { z } from 'zod';

export const studentEnrollmentEditFormSchema = z.object({
  academicYearId: z.string().min(1, 'Informe o ano letivo.'),
  schoolClassId: z.string().optional(),
  enrollmentDate: z.string().min(1, 'Informe a data da matrícula.'),
  enrollmentCode: z.string().optional(),
  observations: z.string().optional(),
});

export type StudentEnrollmentEditFormValues = z.infer<typeof studentEnrollmentEditFormSchema>;
