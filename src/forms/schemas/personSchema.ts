import { z } from 'zod';
import { documentTypeSchema, genderSchema, maritalStatusSchema } from './enums';

export const personSchema = z.object({
  fullName: z.string().min(1),
  documentNumber: z.string().min(3).max(30),
  documentType: documentTypeSchema,
  dateOfBirth: z.string().optional(),
  gender: genderSchema.optional(),
  maritalStatus: maritalStatusSchema.optional(),
  monthlyIncome: z.string().optional(),
});
