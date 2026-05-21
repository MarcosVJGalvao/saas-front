import { z } from 'zod';

export const legalGuardianEditFormSchema = z.object({
  documentNumber: z.string().optional(),
  documentType: z.enum(['CPF', 'CNPJ', 'RG', 'PASSPORT', 'OTHER']).optional(),
  relationshipType: z.enum(['mother', 'father', 'legal_guardian', 'grandparent', 'other']),
});

export type LegalGuardianEditFormValues = z.infer<typeof legalGuardianEditFormSchema>;
