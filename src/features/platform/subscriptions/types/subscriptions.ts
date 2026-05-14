export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'blocked';

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string | null;
  trialEndsAt?: string | null;
  canceledAt?: string | null;
  cancelsAtPeriodEnd: boolean;
  cancelRequestedAt?: string | null;
  renewalDate?: string | null;
  priceAtSubscription: string;
  blockedAt?: string | null;
  blockedReason?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  tenant?: {
    id: string;
    name: string;
    slug?: string;
    status?: string;
    timezone?: string;
    locale?: string;
    currency?: string;
  };
  plan?: {
    id: string;
    name: string;
    description?: string | null;
    price?: string;
    currency?: string;
    billingCycle?: 'monthly' | 'yearly';
    trialDays?: number;
    isActive?: boolean;
  };
}

export interface CreateSubscriptionRequest {
  tenantId?: string;
  planId: string;
  status: SubscriptionStatus;
  startDate?: string;
  endDate?: string;
  trialEndsAt?: string;
  renewalDate?: string;
  priceAtSubscription: string;
  blockedReason?: string;
}

export type UpdateSubscriptionRequest = Partial<CreateSubscriptionRequest>;

export interface CancelSubscriptionRequest {
  immediate?: boolean;
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
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  planId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: SubscriptionStatus;
  tenantId?: string;
}
