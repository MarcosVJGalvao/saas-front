import { z } from 'zod';

const bulkUpdateItemSchema = z.object({
  studentEnrollmentId: z.string().min(1, 'Informe a matrícula.'),
  assessmentType: z.string().min(1, 'Informe o tipo de avaliação.'),
  gradeValue: z.string().min(1, 'Informe a nova nota.'),
  observations: z.string().optional(),
});

export const bulkUpdateFormSchema = z.object({
  schoolClassId: z.string().min(1, 'Informe a turma.'),
  subjectId: z.string().min(1, 'Informe a disciplina.'),
  academicPeriodId: z.string().min(1, 'Informe o período.'),
  entries: z.array(bulkUpdateItemSchema).min(1, 'Informe ao menos um lançamento.'),
});

export type BulkUpdateItemValues = z.infer<typeof bulkUpdateItemSchema>;
export type BulkUpdateFormValues = z.infer<typeof bulkUpdateFormSchema>;

export const buildBulkUpdateInitialValues = (): BulkUpdateFormValues => ({
  schoolClassId: '',
  subjectId: '',
  academicPeriodId: '',
  entries: [{ studentEnrollmentId: '', assessmentType: '', gradeValue: '', observations: '' }],
});
