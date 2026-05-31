import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  NotificationItem,
  NotificationListQueryParams,
  SendNotificationRequest,
  SendNotificationResponse,
} from '@features/client/notifications/types/notification';

export type NotificationsListResponse = PaginatedResponse<NotificationItem>;
export type MarkNotificationReadResponse = NotificationItem;
export type NotificationsListParams = NotificationListQueryParams;
export type SendNotificationPayload = SendNotificationRequest;
export type SendNotificationResult = SendNotificationResponse;
