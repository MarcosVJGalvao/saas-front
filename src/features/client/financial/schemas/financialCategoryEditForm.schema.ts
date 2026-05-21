import { z } from 'zod';

export const financialCategoryEditFormSchema = z.object({
  code: z.string().optional(),
  type: z.enum(['revenue', 'expense'], {
    required_error: 'Selecione o tipo.',
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Selecione o status.',
  }),
  description: z.string().optional(),
});

export type FinancialCategoryEditFormValues = z.infer<typeof financialCategoryEditFormSchema>;
