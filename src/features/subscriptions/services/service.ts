import { platformSubscriptionsEndpoints } from '@features/subscriptions/services/endpoints';
import type {
  SubscriptionCancelPayload,
  SubscriptionCancelResponse,
  SubscriptionCreatePayload,
  SubscriptionCreateResponse,
  SubscriptionDetailsResponse,
  SubscriptionHistoryResponse,
  SubscriptionsListParams,
  SubscriptionsListResponse,
  SubscriptionUpdatePayload,
  SubscriptionUpdateResponse,
} from '@features/subscriptions/services/types';

export const subscriptionsService = {
  async list(params: SubscriptionsListParams): Promise<SubscriptionsListResponse> {
    const { data } = await platformSubscriptionsEndpoints.list(params);
    return data;
  },
  async getById(id: string, tenantId: string): Promise<SubscriptionDetailsResponse> {
    const { data } = await platformSubscriptionsEndpoints.getById(id, tenantId);
    return data;
  },
  async create(payload: SubscriptionCreatePayload): Promise<SubscriptionCreateResponse> {
    const { data } = await platformSubscriptionsEndpoints.create(payload);
    return data;
  },
  async update(
    id: string,
    tenantId: string,
    payload: SubscriptionUpdatePayload,
  ): Promise<SubscriptionUpdateResponse> {
    const { data } = await platformSubscriptionsEndpoints.update(id, tenantId, payload);
    return data;
  },
  async getPlanHistory(id: string, tenantId: string): Promise<SubscriptionHistoryResponse> {
    const { data } = await platformSubscriptionsEndpoints.getPlanHistory(id, tenantId);
    return data;
  },
  async cancel(
    id: string,
    tenantId: string,
    payload: SubscriptionCancelPayload,
  ): Promise<SubscriptionCancelResponse> {
    const { data } = await platformSubscriptionsEndpoints.cancel(id, tenantId, payload);
    return data;
  },
  async remove(id: string, tenantId: string): Promise<void> {
    await platformSubscriptionsEndpoints.remove(id, tenantId);
  },
};
