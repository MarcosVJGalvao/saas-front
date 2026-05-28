import { z } from 'zod';

const classGradeEntryItemSchema = z.object({
  studentEnrollmentId: z.string().min(1, 'Informe a matrícula.'),
  gradeValue: z
    .string()
    .min(1, 'Informe a nota.')
    .refine(
      (val) => {
        const parsed = parseFloat(val.replace(',', '.'));
        return !isNaN(parsed) && parsed >= 0 && parsed <= 10;
      },
      { message: 'A nota deve ser entre 0,00 e 10,00.' },
    ),
  observations: z.string().optional(),
});

export const classGradeEntryFormSchema = z.object({
  schoolClassId: z.string().min(1, 'Informe a turma.'),
  teacherSubjectId: z.string().min(1, 'Informe o professor e a disciplina.'),
  academicPeriodId: z.string().min(1, 'Informe o período.'),
  assessmentType: z.string().min(1, 'Informe o tipo de avaliação.'),
  entries: z.array(classGradeEntryItemSchema).min(1, 'Informe ao menos um aluno.'),
});

export type ClassGradeEntryItemValues = z.infer<typeof classGradeEntryItemSchema>;
export type ClassGradeEntryFormValues = z.infer<typeof classGradeEntryFormSchema>;

export const buildClassGradeEntryInitialValues = (): ClassGradeEntryFormValues => ({
  schoolClassId: '',
  teacherSubjectId: '',
  academicPeriodId: '',
  assessmentType: '',
  entries: [],
});
