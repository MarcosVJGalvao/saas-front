import { z } from 'zod';

export const clientRoleCreateFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome.'),
  description: z.string(),
  permissionIds: z.array(z.string().uuid()),
});

export type ClientRoleCreateFormValues = z.infer<typeof clientRoleCreateFormSchema>;
