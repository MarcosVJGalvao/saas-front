import { z } from 'zod';

export const clientUserCreateFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome.'),
  email: z.union([z.literal(''), z.string().trim().email('Informe um e-mail válido.')]),
  roleId: z.string(),
});

export type ClientUserCreateFormValues = z.infer<typeof clientUserCreateFormSchema>;
