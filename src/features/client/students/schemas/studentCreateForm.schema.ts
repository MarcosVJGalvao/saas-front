import { z } from 'zod';

export const studentCreateFormSchema = z.object({
  fullName: z.string().min(1, 'Informe o nome completo.'),
  documentNumber: z.string().optional(),
  documentType: z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  registrationCode: z.string().optional(),
  status: z.enum(['active', 'inactive', 'cancelled']),
});

export type StudentCreateFormValues = z.infer<typeof studentCreateFormSchema>;
