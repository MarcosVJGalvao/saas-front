import { z } from 'zod';

export const clientRoleEditFormSchema = z.object({
  status: z.enum(['active', 'inactive']),
  description: z.string(),
});

export type ClientRoleEditFormValues = z.infer<typeof clientRoleEditFormSchema>;
