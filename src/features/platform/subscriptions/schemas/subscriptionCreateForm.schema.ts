import { z } from 'zod';

export const subscriptionCreateFormSchema = z.object({
  tenantId: z.string().trim().min(1, 'Informe o tenant da assinatura.'),
  planId: z.string().trim().min(1, 'Selecione o plano.'),
  status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'blocked']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  trialEndsAt: z.string().optional(),
  renewalDate: z.string().optional(),
  priceAtSubscription: z.string().trim().min(1, 'Informe o preço contratado.'),
  blockedReason: z.string().optional(),
});

export type SubscriptionCreateFormValues = z.infer<typeof subscriptionCreateFormSchema>;
