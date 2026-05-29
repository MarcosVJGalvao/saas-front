import { z } from 'zod';

export const financialCostCenterCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  code: z.string().optional(),
  description: z.string().optional(),
});

export type FinancialCostCenterCreateFormValues = z.infer<
  typeof financialCostCenterCreateFormSchema
>;
