import { z } from 'zod';
import { documentTypeSchema } from '@shared/schemas/commonEnums';

export const clientStatusSchema = z.enum(['active', 'inactive']);

export const clientCreateFormSchema = z.object({
  legalName: z.string().min(1, 'Informe a razão social.'),
  tradeName: z.string().min(1, 'Informe o nome fantasia.'),
  documentNumber: z.string().min(8, 'Informe um documento válido.').max(30),
  documentType: documentTypeSchema,
  email: z.string().email('Informe um e-mail válido.'),
  phone: z.string().min(10, 'Informe um telefone válido.'),
  status: clientStatusSchema,
  logoUrl: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientCreateFormValues = z.infer<typeof clientCreateFormSchema>;
