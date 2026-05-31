import { z } from 'zod';

const EVENT_KEY_MAX_LENGTH = 150;
const MESSAGE_MAX_LENGTH = 500;

export const sendNotificationFormSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Informe a mensagem da notificação.')
    .max(MESSAGE_MAX_LENGTH, `A mensagem deve ter no máximo ${MESSAGE_MAX_LENGTH} caracteres.`),
  targetUserIds: z.array(z.string()),
});

export { EVENT_KEY_MAX_LENGTH, MESSAGE_MAX_LENGTH };

export type SendNotificationFormValues = z.infer<typeof sendNotificationFormSchema>;
