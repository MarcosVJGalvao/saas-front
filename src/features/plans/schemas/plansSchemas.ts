import { z } from 'zod';

export const billingCycleSchema = z.enum(['monthly', 'yearly']);

export const createPlanSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string(),
  currency: z.string(),
  billingCycle: billingCycleSchema,
  trialDays: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const updatePlanSchema = createPlanSchema.partial();

export const plansQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
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
