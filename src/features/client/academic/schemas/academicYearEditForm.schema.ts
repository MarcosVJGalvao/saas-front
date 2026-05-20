import { z } from 'zod';

export const academicYearEditFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  status: z.enum(['scheduled', 'active', 'closed']),
  startDate: z.string().min(1, 'Informe a data inicial.'),
  endDate: z.string().min(1, 'Informe a data final.'),
  periodName: z.string().min(1, 'Informe o período acadêmico.'),
  periodCode: z.string().min(1, 'Informe o código do período.'),
  periodSequence: z.string().min(1, 'Informe a sequência do período.'),
  periodStartDate: z.string().min(1, 'Informe a data inicial do período.'),
  periodEndDate: z.string().min(1, 'Informe a data final do período.'),
  periodWeight: z.string().optional(),
  periodIsFinal: z.string().optional(),
  calculationType: z.string().min(1, 'Informe o tipo de cálculo.'),
  passingGrade: z.string().min(1, 'Informe a nota mínima.'),
  minimumAttendancePercentage: z.string().min(1, 'Informe a frequência mínima.'),
  recoveryStrategy: z.string().min(1, 'Informe a estratégia de recuperação.'),
  finalStatusStrategy: z.string().min(1, 'Informe a estratégia de status final.'),
  description: z.string().optional(),
});

export type AcademicYearEditFormValues = z.infer<typeof academicYearEditFormSchema>;
