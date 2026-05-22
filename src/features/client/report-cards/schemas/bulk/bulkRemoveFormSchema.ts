import { z } from 'zod';

const bulkRemoveItemSchema = z.object({
  studentEnrollmentId: z.string().min(1, 'Informe a matrícula.'),
  assessmentType: z.string().min(1, 'Informe o tipo de avaliação.'),
});

export const bulkRemoveFormSchema = z.object({
  schoolClassId: z.string().min(1, 'Informe a turma.'),
  subjectId: z.string().min(1, 'Informe a disciplina.'),
  academicPeriodId: z.string().min(1, 'Informe o período.'),
  entries: z.array(bulkRemoveItemSchema).min(1, 'Informe ao menos um lançamento.'),
});

export type BulkRemoveItemValues = z.infer<typeof bulkRemoveItemSchema>;
export type BulkRemoveFormValues = z.infer<typeof bulkRemoveFormSchema>;

export const buildBulkRemoveInitialValues = (): BulkRemoveFormValues => ({
  schoolClassId: '',
  subjectId: '',
  academicPeriodId: '',
  entries: [{ studentEnrollmentId: '', assessmentType: '' }],
});
