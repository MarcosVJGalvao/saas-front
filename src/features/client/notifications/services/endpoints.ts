import { httpClient } from '@shared/services/httpClient';
import type {
  MarkNotificationReadResponse,
  NotificationsListParams,
  NotificationsListResponse,
  SendNotificationPayload,
  SendNotificationResult,
} from '@features/client/notifications/services/types';

const BASE_PATH = '/api/notifications';

export const notificationEndpoints = {
  list: (params: NotificationsListParams) =>
    httpClient.get<NotificationsListResponse>(BASE_PATH, {
      params,
    }),
  markAsRead: (id: string) =>
    httpClient.patch<MarkNotificationReadResponse>(`${BASE_PATH}/${id}/read`),
  sendInApp: (payload: SendNotificationPayload) =>
    httpClient.post<SendNotificationResult>(`${BASE_PATH}/in-app/send`, payload),
};
