import type {
  NotificationItem,
  NotificationMenuItem,
  SendNotificationRequest,
} from '@features/client/notifications/types/notification';
import type { SendNotificationFormValues } from '@features/client/notifications/schemas/sendNotificationForm.schema';

const splitTargetUserIds = (rawTargetUserIds: string): string[] =>
  rawTargetUserIds
    .split(',')
    .map((targetUserId) => targetUserId.trim())
    .filter((targetUserId) => targetUserId.length > 0);

export const createSendNotificationInitialValues = (): SendNotificationFormValues => ({
  eventKey: '',
  message: '',
  targetUserIds: '',
});

export const toSendNotificationPayload = (
  values: SendNotificationFormValues,
): SendNotificationRequest => {
  const targetUserIds = splitTargetUserIds(values.targetUserIds);

  if (targetUserIds.length === 0) {
    return {
      eventKey: values.eventKey.trim(),
      message: values.message.trim(),
    };
  }

  return {
    eventKey: values.eventKey.trim(),
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
