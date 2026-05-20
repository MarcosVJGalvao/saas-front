import { z } from 'zod';

export const clientRoleCreateFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome.'),
  status: z.enum(['active', 'inactive']),
  description: z.string(),
});

export type ClientRoleCreateFormValues = z.infer<typeof clientRoleCreateFormSchema>;
