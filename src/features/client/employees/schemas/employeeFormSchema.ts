import { z } from 'zod';

export const employeeFormSchema = z.object({
  personId: z.string().optional(),
  fullName: z.string().optional(),
  documentNumber: z.string().optional(),
  jobTitle: z.string().min(1, 'Informe o cargo.'),
  department: z.string().optional(),
  status: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
