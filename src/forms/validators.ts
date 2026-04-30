import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres.'),
});

export const totpCodeSchema = z.object({
  totpCode: z
    .string()
    .min(6, 'Informe o código de 6 dígitos.')
    .max(6, 'Informe o código de 6 dígitos.')
    .regex(/^\d+$/, 'O código deve conter apenas números.'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type TotpCodeSchema = z.infer<typeof totpCodeSchema>;
