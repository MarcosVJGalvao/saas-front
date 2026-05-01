import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalido.'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres.'),
  rememberMe: z.boolean(),
});

export const totpCodeSchema = z.object({
  totpCode: z
    .string()
    .min(6, 'Informe o codigo de 6 digitos.')
    .max(6, 'Informe o codigo de 6 digitos.')
    .regex(/^\d+$/, 'O codigo deve conter apenas numeros.'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type TotpCodeSchema = z.infer<typeof totpCodeSchema>;
