import { z } from 'zod';

export const legalGuardianCreateFormSchema = z.object({
  fullName: z.string().min(1, 'Informe o nome completo.'),
  documentNumber: z.string().optional(),
  documentType: z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']).optional(),
  relationshipType: z.enum(['mother', 'father', 'legal_guardian', 'grandparent', 'other']),
});

export type LegalGuardianCreateFormValues = z.infer<typeof legalGuardianCreateFormSchema>;
