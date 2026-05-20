import { z } from 'zod';

export const planCreateFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do plano.'),
  description: z.string().optional(),
  price: z.string().trim().min(1, 'Informe o preço do plano.'),
  currency: z.string().trim().min(1, 'Informe a moeda.'),
  billingCycle: z.enum(['monthly', 'yearly']),
  trialDays: z.coerce.number().int().min(0, 'O trial deve ser zero ou maior.'),
  isActive: z.boolean(),
});

export type PlanCreateFormValues = z.infer<typeof planCreateFormSchema>;
