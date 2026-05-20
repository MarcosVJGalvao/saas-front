import { normalizeOptionalDateToIsoDate } from '@shared/normalizers/dateNormalizers';
import { normalizeCurrencyValue } from '@shared/normalizers/currencyNormalizers';
import type { SubscriptionCreateFormValues } from '@features/platform/subscriptions/schemas/subscriptionCreateForm.schema';
import type { SubscriptionEditFormValues } from '@features/platform/subscriptions/schemas/subscriptionEditForm.schema';
import type {
  CreateSubscriptionRequest,
  Subscription,
  UpdateSubscriptionRequest,
} from '@features/platform/subscriptions/types/subscriptions';

export const toSubscriptionCreatePayload = (
  values: SubscriptionCreateFormValues,
): CreateSubscriptionRequest => ({
  tenantId: values.tenantId.trim(),
  planId: values.planId.trim(),
  status: values.status,
  startDate: normalizeOptionalDateToIsoDate(values.startDate),
  endDate: normalizeOptionalDateToIsoDate(values.endDate),
  trialEndsAt: normalizeOptionalDateToIsoDate(values.trialEndsAt),
  renewalDate: normalizeOptionalDateToIsoDate(values.renewalDate),
  priceAtSubscription: normalizeCurrencyValue(values.priceAtSubscription),
  blockedReason: values.blockedReason?.trim() || undefined,
});

export const toSubscriptionEditFormValues = (
  subscription: Subscription,
): SubscriptionEditFormValues => ({
  tenantId: subscription.tenantId,
  planId: subscription.planId,
  status: subscription.status,
  startDate: subscription.startDate,
  endDate: subscription.endDate ?? '',
  trialEndsAt: subscription.trialEndsAt ?? '',
  renewalDate: subscription.renewalDate ?? '',
  priceAtSubscription: subscription.priceAtSubscription,
  blockedReason: subscription.blockedReason ?? '',
});

export const toSubscriptionEditPayload = (
  values: SubscriptionEditFormValues,
): UpdateSubscriptionRequest => ({
  tenantId: values.tenantId.trim(),
  planId: values.planId.trim(),
  status: values.status,
  startDate: normalizeOptionalDateToIsoDate(values.startDate),
  endDate: normalizeOptionalDateToIsoDate(values.endDate),
  trialEndsAt: normalizeOptionalDateToIsoDate(values.trialEndsAt),
  renewalDate: normalizeOptionalDateToIsoDate(values.renewalDate),
  priceAtSubscription: normalizeCurrencyValue(values.priceAtSubscription),
  blockedReason: values.blockedReason?.trim() || undefined,
});
