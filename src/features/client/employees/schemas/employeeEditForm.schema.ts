import { z } from 'zod';

export const employeeEditFormSchema = z.object({
  jobTitle: z.string().min(1, 'Informe o cargo.'),
  department: z.string().optional(),
  status: z.string().optional(),
});

export type EmployeeEditFormValues = z.infer<typeof employeeEditFormSchema>;
