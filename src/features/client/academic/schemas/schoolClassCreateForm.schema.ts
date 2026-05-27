import { z } from 'zod';

export const schoolClassCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  code: z.string().optional(),
  shift: z.enum(['morning', 'afternoon', 'evening', 'full_time']),
  maxCapacity: z.coerce
    .number({ message: 'Informe a capacidade máxima.' })
    .int('Informe uma capacidade inteira.')
    .min(0, 'A capacidade não pode ser negativa.'),
  academicYearId: z.string().min(1, 'Informe o ano letivo.'),
  gradeId: z.string().min(1, 'Informe a série.'),
  coordinatorId: z.string().min(1, 'Informe o coordenador.'),
  description: z.string().optional(),
});

export type SchoolClassCreateFormValues = z.infer<typeof schoolClassCreateFormSchema>;
