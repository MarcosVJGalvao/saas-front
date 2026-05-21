import { z } from 'zod';

export const studentEditFormSchema = z.object({
  documentNumber: z.string().optional(),
  documentType: z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  registrationCode: z.string().optional(),
  status: z.enum(['active', 'inactive', 'cancelled']),
});

export type StudentEditFormValues = z.infer<typeof studentEditFormSchema>;
