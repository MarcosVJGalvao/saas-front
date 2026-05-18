import { z } from 'zod';

export const adminEntityFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  email: z.union([z.literal(''), z.string().trim().email('Informe um e-mail válido.')]).optional(),
  roleId: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  description: z.string().optional(),
});

export type AdminEntityFormValues = z.infer<typeof adminEntityFormSchema>;
