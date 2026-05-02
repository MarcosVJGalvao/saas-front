import { z } from 'zod';

export const subscriptionStatusSchema = z.enum([
  'active',
  'canceled',
  'past_due',
  'trialing',
  'blocked',
]);

export const createSubscriptionSchema = z.object({
  tenantId: z.string().optional(),
  planId: z.string(),
  status: subscriptionStatusSchema,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  trialEndsAt: z.string().datetime().optional(),
  renewalDate: z.string().datetime().optional(),
  priceAtSubscription: z.string(),
  blockedReason: z.string().optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export const cancelSubscriptionSchema = z.object({
  immediate: z.boolean().optional(),
});

export const subscriptionsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
    status: subscriptionStatusSchema.optional(),
    tenantId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if ((data.startDate && !data.endDate) || (!data.startDate && data.endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: 'Informe startDate e endDate juntos.',
      });
    }
  });
