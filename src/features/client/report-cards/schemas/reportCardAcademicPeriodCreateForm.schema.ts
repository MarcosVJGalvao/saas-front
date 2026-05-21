import { z } from 'zod';

export const reportCardAcademicPeriodCreateFormSchema = z.object({
  academicYearId: z.string().min(1, 'Informe o ano letivo.'),
  name: z.string().min(1, 'Informe o nome do período.'),
  code: z.string().optional(),
  sequence: z.string().min(1, 'Informe a sequência.'),
  startDate: z.string().min(1, 'Informe a data inicial.'),
  endDate: z.string().min(1, 'Informe a data final.'),
  weight: z.string().min(1, 'Informe o peso.'),
  isFinalPeriod: z.string().optional(),
});

export type ReportCardAcademicPeriodCreateFormValues = z.infer<
  typeof reportCardAcademicPeriodCreateFormSchema
>;
