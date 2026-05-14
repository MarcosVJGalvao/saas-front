import { httpClient } from '@shared/services/httpClient';
import type {
  SubscriptionCancelPayload,
  SubscriptionCancelResponse,
  SubscriptionCreatePayload,
  SubscriptionCreateResponse,
  SubscriptionDeleteResponse,
  SubscriptionDetailsResponse,
  SubscriptionHistoryResponse,
  SubscriptionsListParams,
  SubscriptionsListResponse,
  SubscriptionUpdatePayload,
  SubscriptionUpdateResponse,
} from '@features/subscriptions/services/types';

const PLATFORM_SUBSCRIPTIONS_BASE_PATH = '/api/platform/subscriptions';

export const platformSubscriptionsEndpoints = {
  list: (params: SubscriptionsListParams) =>
    httpClient.get<SubscriptionsListResponse>(PLATFORM_SUBSCRIPTIONS_BASE_PATH, {
      params: { ...params, sortOrder: 'DESC' },
    }),
  getById: (id: string, tenantId: string) =>
    httpClient.get<SubscriptionDetailsResponse>(`${PLATFORM_SUBSCRIPTIONS_BASE_PATH}/${id}`, {
      params: { tenantId },
    }),
  create: (payload: SubscriptionCreatePayload) =>
    httpClient.post<SubscriptionCreateResponse>(PLATFORM_SUBSCRIPTIONS_BASE_PATH, payload),
  update: (id: string, tenantId: string, payload: SubscriptionUpdatePayload) =>
    httpClient.patch<SubscriptionUpdateResponse>(
      `${PLATFORM_SUBSCRIPTIONS_BASE_PATH}/${id}`,
      payload,
      {
        params: { tenantId },
      },
    ),
  getPlanHistory: (id: string, tenantId: string) =>
    httpClient.get<SubscriptionHistoryResponse>(
      `${PLATFORM_SUBSCRIPTIONS_BASE_PATH}/${id}/plan-history`,
      { params: { tenantId } },
    ),
  cancel: (id: string, tenantId: string, payload: SubscriptionCancelPayload) =>
    httpClient.post<SubscriptionCancelResponse>(
      `${PLATFORM_SUBSCRIPTIONS_BASE_PATH}/${id}/cancel`,
      payload,
      { params: { tenantId } },
    ),
  remove: (id: string, tenantId: string) =>
    httpClient.delete<SubscriptionDeleteResponse>(`${PLATFORM_SUBSCRIPTIONS_BASE_PATH}/${id}`, {
      params: { tenantId },
    }),
};
