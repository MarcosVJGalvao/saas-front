import { z } from 'zod';

export const notificationItemSchema = z.object({
  id: z.string().min(1, 'Informe o identificador da notificação.'),
  message: z.string().min(1, 'Informe a mensagem da notificação.'),
  read: z.boolean(),
});

export const notificationListQueryParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export const sendNotificationRequestSchema = z.object({
  eventKey: z.string().min(1, 'Informe a chave do evento.'),
  message: z.string().min(1, 'Informe a mensagem da notificação.'),
  targetUserIds: z.array(z.string().min(1)).optional(),
});

export const sendNotificationResponseSchema = z.object({
  status: z.literal('SENT'),
  deliveredCount: z.number().int().nonnegative(),
});

export const notificationsListResponseSchema = z.object({
  data: z.array(notificationItemSchema),
  meta: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type NotificationItem = z.infer<typeof notificationItemSchema>;
export type NotificationListQueryParams = z.infer<typeof notificationListQueryParamsSchema>;
export type SendNotificationRequest = z.infer<typeof sendNotificationRequestSchema>;
export type SendNotificationResponse = z.infer<typeof sendNotificationResponseSchema>;

export interface NotificationMenuItem {
  id: string;
  message: string;
  unread: boolean;
}
