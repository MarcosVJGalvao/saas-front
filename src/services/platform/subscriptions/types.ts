import type { PaginatedResponse } from '../../../models/pagination';
import type {
  CancelSubscriptionRequest,
  CreateSubscriptionRequest,
  Subscription,
  SubscriptionPlanHistory,
  SubscriptionsQueryParams,
  UpdateSubscriptionRequest,
} from '../../../models/subscriptions';

export type SubscriptionsListResponse = PaginatedResponse<Subscription>;
export type SubscriptionDetailsResponse = Subscription;
export type SubscriptionCreateResponse = Subscription;
export type SubscriptionUpdateResponse = Subscription;
export type SubscriptionDeleteResponse = void;
export type SubscriptionCancelResponse = Subscription;
export type SubscriptionHistoryResponse = SubscriptionPlanHistory[];

export type SubscriptionsListParams = SubscriptionsQueryParams;
export type SubscriptionCreatePayload = CreateSubscriptionRequest;
export type SubscriptionUpdatePayload = UpdateSubscriptionRequest;
export type SubscriptionCancelPayload = CancelSubscriptionRequest;
