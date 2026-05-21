import { z } from 'zod';

export const medicalInfoFormSchema = z.object({
  personId: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  medications: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  notes: z.string().optional(),
});

export type MedicalInfoFormValues = z.infer<typeof medicalInfoFormSchema>;
