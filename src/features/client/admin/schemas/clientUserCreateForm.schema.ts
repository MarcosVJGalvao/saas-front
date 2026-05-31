import { z } from 'zod';

export const clientUserCreateFormSchema = z.object({
  employeeId: z.string().trim().min(1, 'Selecione um funcionario.'),
  email: z.string().trim().min(1, 'Informe um e-mail.').email('Informe um e-mail valido.'),
  password: z.string().trim().min(8, 'Informe uma senha com pelo menos 8 caracteres.'),
});

export type ClientUserCreateFormValues = z.infer<typeof clientUserCreateFormSchema>;
