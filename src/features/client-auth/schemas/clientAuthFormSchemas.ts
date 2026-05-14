import { z } from 'zod';
import { loginSchema } from '@shared/schemas/authSchemas';

export const forgotPasswordSchema = loginSchema.pick({ email: true });

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
