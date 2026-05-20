import { z } from 'zod';

export const reportCardGradeSubjectCreateFormSchema = z.object({
  academicYearId: z.string().min(1, 'Informe o ano letivo.'),
  gradeId: z.string().min(1, 'Informe a série.'),
  subjectId: z.string().min(1, 'Informe a disciplina.'),
  workloadHours: z.string().min(1, 'Informe a carga horária.'),
  displayOrder: z.string().min(1, 'Informe a ordem.'),
  isMandatory: z.string().optional(),
});

export type ReportCardGradeSubjectCreateFormValues = z.infer<
  typeof reportCardGradeSubjectCreateFormSchema
>;
