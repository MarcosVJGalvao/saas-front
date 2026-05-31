import type {
  NotificationItem,
  NotificationMenuItem,
  SendNotificationRequest,
} from '@features/client/notifications/types/notification';
import type { SendNotificationFormValues } from '@features/client/notifications/schemas/sendNotificationForm.schema';

export const FRONT_SEND_NOTIFICATION_EVENT_KEY = 'client.notifications.manual_send';

const normalizeTargetUserIds = (targetUserIds: string[]): string[] =>
  targetUserIds
    .map((targetUserId) => targetUserId.trim())
    .filter((targetUserId) => targetUserId.length > 0);

export const createSendNotificationInitialValues = (): SendNotificationFormValues => ({
  message: '',
  targetUserIds: [],
});

export const toSendNotificationPayload = (
  values: SendNotificationFormValues,
): SendNotificationRequest => {
  const targetUserIds = normalizeTargetUserIds(values.targetUserIds);

  if (targetUserIds.length === 0) {
    return {
      eventKey: FRONT_SEND_NOTIFICATION_EVENT_KEY,
      message: values.message.trim(),
    };
  }

  return {
    eventKey: FRONT_SEND_NOTIFICATION_EVENT_KEY,
    message: values.message.trim(),
    targetUserIds,
  };
};

export const toNotificationMenuItems = (
  notifications: NotificationItem[],
): NotificationMenuItem[] =>
  notifications.map((notification) => ({
    id: notification.id,
    message: notification.message,
    unread: !notification.read,
  }));
