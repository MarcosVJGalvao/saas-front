import {
  notificationsListResponseSchema,
  notificationItemSchema,
  sendNotificationResponseSchema,
} from '@features/client/notifications/types/notification';
import { notificationEndpoints } from '@features/client/notifications/services/endpoints';
import type {
  MarkNotificationReadResponse,
  NotificationsListParams,
  NotificationsListResponse,
  SendNotificationPayload,
  SendNotificationResult,
} from '@features/client/notifications/services/types';

const removeEmptyTargetUserIds = (payload: SendNotificationPayload): SendNotificationPayload => {
  const normalizedTargetUserIds = payload.targetUserIds?.filter(
    (userId) => userId.trim().length > 0,
  );

  if (normalizedTargetUserIds === undefined || normalizedTargetUserIds.length === 0) {
    return {
      eventKey: payload.eventKey,
      message: payload.message,
    };
  }

  return {
    eventKey: payload.eventKey,
    message: payload.message,
    targetUserIds: normalizedTargetUserIds,
  };
};

export const notificationService = {
  async list(params: NotificationsListParams): Promise<NotificationsListResponse> {
    const { data } = await notificationEndpoints.list(params);
    return notificationsListResponseSchema.parse(data);
  },

  async markAsRead(id: string): Promise<MarkNotificationReadResponse> {
    const { data } = await notificationEndpoints.markAsRead(id);
    return notificationItemSchema.parse(data);
  },

  async sendInApp(payload: SendNotificationPayload): Promise<SendNotificationResult> {
    const normalizedPayload = removeEmptyTargetUserIds(payload);
    const { data } = await notificationEndpoints.sendInApp(normalizedPayload);
    return sendNotificationResponseSchema.parse(data);
  },
};
