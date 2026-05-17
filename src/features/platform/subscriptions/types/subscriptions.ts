export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'blocked';

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string | null | undefined;
  trialEndsAt?: string | null | undefined;
  canceledAt?: string | null | undefined;
  cancelsAtPeriodEnd: boolean;
  cancelRequestedAt?: string | null | undefined;
  renewalDate?: string | null | undefined;
  priceAtSubscription: string;
  blockedAt?: string | null | undefined;
  blockedReason?: string | null | undefined;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null | undefined;
  createdBy?: string | null | undefined;
  updatedBy?: string | null | undefined;
  deletedBy?: string | null | undefined;
  tenant?: {
    id: string;
    name: string;
    slug?: string | undefined;
    status?: string | undefined;
    timezone?: string | undefined;
    locale?: string | undefined;
    currency?: string | undefined;
  };
  plan?: {
    id: string;
    name: string;
    description?: string | null | undefined;
    price?: string | undefined;
    currency?: string | undefined;
    billingCycle?: 'monthly' | 'yearly' | undefined;
    trialDays?: number | undefined;
    isActive?: boolean | undefined;
  };
}

export interface CreateSubscriptionRequest {
  tenantId?: string | undefined;
  planId: string;
  status: SubscriptionStatus;
  startDate?: string | undefined;
  endDate?: string | undefined;
  trialEndsAt?: string | undefined;
  renewalDate?: string | undefined;
  priceAtSubscription: string;
  blockedReason?: string | undefined;
}

export type UpdateSubscriptionRequest = {
  [Key in keyof CreateSubscriptionRequest]?: CreateSubscriptionRequest[Key] | undefined;
};

export interface CancelSubscriptionRequest {
  immediate?: boolean | undefined;
}

export interface SubscriptionPlanHistory {
  id: string;
  tenantId: string;
  subscriptionId: string;
  fromPlanId: string | null;
  toPlanId: string;
  changedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionsQueryParams {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  planId?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'ASC' | 'DESC' | undefined;
  status?: SubscriptionStatus | undefined;
  tenantId?: string | undefined;
}
