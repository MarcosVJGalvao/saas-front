import { z } from 'zod';

export const reportCardEntryFormSchema = z.object({
  studentEnrollmentId: z.string().min(1, 'Informe a matrícula.'),
  subjectId: z.string().min(1, 'Informe a disciplina.'),
  academicPeriodId: z.string().min(1, 'Informe o período.'),
  assessmentType: z.string().min(1, 'Informe o tipo de avaliação.'),
  gradeValue: z.string().min(1, 'Informe a nota.'),
  observations: z.string().optional(),
});

export type ReportCardEntryFormValues = z.infer<typeof reportCardEntryFormSchema>;
