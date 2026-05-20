import { z } from 'zod';

export const clientUserEditFormSchema = z.object({
  email: z.union([z.literal(''), z.string().trim().email('Informe um e-mail válido.')]),
  roleId: z.string(),
  status: z.enum(['active', 'inactive']),
});

export type ClientUserEditFormValues = z.infer<typeof clientUserEditFormSchema>;
