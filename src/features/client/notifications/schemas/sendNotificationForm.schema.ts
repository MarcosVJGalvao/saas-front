import { z } from 'zod';

export const sendNotificationFormSchema = z.object({
  eventKey: z.string().trim().min(1, 'Informe a chave do evento.'),
  message: z.string().trim().min(1, 'Informe a mensagem da notificação.'),
  targetUserIds: z.string(),
});

export type SendNotificationFormValues = z.infer<typeof sendNotificationFormSchema>;
