import { z } from 'zod';

export const financialCategoryCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  code: z.string().optional(),
  type: z.enum(['revenue', 'expense'], {
    required_error: 'Selecione o tipo.',
  }),
  description: z.string().optional(),
});

export type FinancialCategoryCreateFormValues = z.infer<typeof financialCategoryCreateFormSchema>;
