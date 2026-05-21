import { z } from 'zod';
import { clientStatusSchema } from '@features/platform/clients/schemas/clientCreateForm.schema';

export const clientEditFormSchema = z.object({
  legalName: z.string().min(1, 'Informe a razão social.'),
  tradeName: z.string().min(1, 'Informe o nome fantasia.'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z.string().min(10, 'Informe um telefone válido.'),
  status: clientStatusSchema,
  logoUrl: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientEditFormValues = z.infer<typeof clientEditFormSchema>;
