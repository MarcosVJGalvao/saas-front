import { z } from 'zod';

export const academicCatalogCreateFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome.'),
  code: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  description: z.string().optional(),
  educationLevelId: z.string().optional(),
});

export type AcademicCatalogCreateFormValues = z.infer<typeof academicCatalogCreateFormSchema>;
