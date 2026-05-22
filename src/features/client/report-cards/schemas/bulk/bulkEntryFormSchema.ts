import { z } from 'zod';

const bulkEntryItemSchema = z.object({
  studentEnrollmentId: z.string().min(1, 'Informe a matrícula.'),
  assessmentType: z.string().min(1, 'Informe o tipo de avaliação.'),
  gradeValue: z.string().min(1, 'Informe a nota.'),
  observations: z.string().optional(),
});

export const bulkEntryFormSchema = z.object({
  schoolClassId: z.string().min(1, 'Informe a turma.'),
  subjectId: z.string().min(1, 'Informe a disciplina.'),
  academicPeriodId: z.string().min(1, 'Informe o período.'),
  entries: z.array(bulkEntryItemSchema).min(1, 'Informe ao menos um aluno.'),
});

export type BulkEntryItemValues = z.infer<typeof bulkEntryItemSchema>;
export type BulkEntryFormValues = z.infer<typeof bulkEntryFormSchema>;

export const buildBulkEntryInitialValues = (): BulkEntryFormValues => ({
  schoolClassId: '',
  subjectId: '',
  academicPeriodId: '',
  entries: [{ studentEnrollmentId: '', assessmentType: '', gradeValue: '', observations: '' }],
});
