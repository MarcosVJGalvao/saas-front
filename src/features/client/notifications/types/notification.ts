import { z } from 'zod';
import {
  EVENT_KEY_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
} from '@features/client/notifications/schemas/sendNotificationForm.schema';

export const notificationItemSchema = z.object({
  id: z.string().min(1, 'Informe o identificador da notificação.'),
  message: z.string().min(1, 'Informe a mensagem da notificação.'),
  read: z.boolean(),
});

export const notificationCreatedEventSchema = z.object({
  eventKey: z.string().min(1).max(EVENT_KEY_MAX_LENGTH),
  message: z.string().min(1).max(MESSAGE_MAX_LENGTH),
  notifications: z.array(notificationItemSchema).default([]),
});

export const notificationListQueryParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export const sendNotificationRequestSchema = z.object({
  eventKey: z
    .string()
    .min(1, 'Informe a chave do evento.')
    .max(
      EVENT_KEY_MAX_LENGTH,
      `A chave do evento deve ter no máximo ${EVENT_KEY_MAX_LENGTH} caracteres.`,
    ),
  message: z
    .string()
    .min(1, 'Informe a mensagem da notificação.')
    .max(MESSAGE_MAX_LENGTH, `A mensagem deve ter no máximo ${MESSAGE_MAX_LENGTH} caracteres.`),
  targetUserIds: z.array(z.string().min(1)).optional(),
});

export const sendNotificationResponseSchema = z.object({
  status: z.string().min(1),
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
export type NotificationCreatedEvent = z.infer<typeof notificationCreatedEventSchema>;
export type NotificationListQueryParams = z.infer<typeof notificationListQueryParamsSchema>;
export type SendNotificationRequest = z.infer<typeof sendNotificationRequestSchema>;
export type SendNotificationResponse = z.infer<typeof sendNotificationResponseSchema>;

export interface NotificationMenuItem {
  id: string;
  message: string;
  unread: boolean;
}
