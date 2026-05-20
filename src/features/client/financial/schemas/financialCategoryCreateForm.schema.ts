import { z } from 'zod';

export const financialCategoryCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  code: z.string().optional(),
  type: z.enum(['revenue', 'expense'], {
    required_error: 'Selecione o tipo.',
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Selecione o status.',
  }),
  description: z.string().optional(),
});

export type FinancialCategoryCreateFormValues = z.infer<typeof financialCategoryCreateFormSchema>;
