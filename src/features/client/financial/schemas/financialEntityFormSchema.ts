import { z } from 'zod';

export const financialEntityFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  code: z.string().optional(),
  type: z.enum(['revenue', 'expense']).optional(),
  status: z.enum(['active', 'inactive']),
  description: z.string().optional(),
});

export type FinancialEntityFormValues = z.infer<typeof financialEntityFormSchema>;
