import { z } from 'zod';

export const financialCostCenterCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  code: z.string().optional(),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Selecione o status.',
  }),
  description: z.string().optional(),
});

export type FinancialCostCenterCreateFormValues = z.infer<
  typeof financialCostCenterCreateFormSchema
>;
