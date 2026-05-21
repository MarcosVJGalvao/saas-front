import { z } from 'zod';

export const personFormSchema = z.object({
  fullName: z.string().min(1, 'Informe o nome completo.'),
  documentType: z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']).optional(),
  documentNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),
  nationality: z.enum(['brazilian', 'foreign', 'other']).optional(),
});

export type PersonFormValues = z.infer<typeof personFormSchema>;
