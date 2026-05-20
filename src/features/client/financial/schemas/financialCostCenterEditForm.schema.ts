import { z } from 'zod';

export const financialCostCenterEditFormSchema = z.object({
  code: z.string().optional(),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Selecione o status.',
  }),
  description: z.string().optional(),
});

export type FinancialCostCenterEditFormValues = z.infer<typeof financialCostCenterEditFormSchema>;
