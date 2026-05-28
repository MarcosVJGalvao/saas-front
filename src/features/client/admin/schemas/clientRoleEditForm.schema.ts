import { z } from 'zod';

export const clientRoleEditFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome.'),
  description: z.string(),
  permissionIds: z.array(z.string().uuid()),
});

export type ClientRoleEditFormValues = z.infer<typeof clientRoleEditFormSchema>;
