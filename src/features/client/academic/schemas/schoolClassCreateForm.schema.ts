import { z } from 'zod';

export const schoolClassCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  code: z.string().optional(),
  status: z.enum(['active', 'inactive', 'cancelled']),
  shift: z.enum(['morning', 'afternoon', 'evening', 'full_time']),
  capacity: z.string().optional(),
  academicYearId: z.string().min(1, 'Informe o ano letivo.'),
  gradeId: z.string().min(1, 'Informe a série.'),
  educationLevelId: z.string().optional(),
  description: z.string().optional(),
});

export type SchoolClassCreateFormValues = z.infer<typeof schoolClassCreateFormSchema>;
