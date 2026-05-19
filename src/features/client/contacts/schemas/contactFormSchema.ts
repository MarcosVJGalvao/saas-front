import { z } from 'zod';

export const contactFormSchema = z.object({
  personId: z.string().optional(),
  type: z.enum(['email', 'phone', 'whatsapp', 'linkedin', 'other']),
  value: z.string().min(1, 'Informe o contato.'),
  label: z.string().optional(),
  isPrimary: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
