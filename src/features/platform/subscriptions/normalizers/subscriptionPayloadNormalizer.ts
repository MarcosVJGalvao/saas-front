import { normalizeCurrencyValue } from '@shared/normalizers/currencyNormalizers';
import { normalizeOptionalDateToIsoDate } from '@shared/normalizers/dateNormalizers';
import type {
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from '@features/platform/subscriptions/types/subscriptions';

export const normalizeSubscriptionPayload = (
  payload: CreateSubscriptionRequest,
): CreateSubscriptionRequest => ({
  ...payload,
  tenantId: payload.tenantId?.trim() || undefined,
  planId: payload.planId.trim(),
  startDate: normalizeOptionalDateToIsoDate(payload.startDate),
  endDate: normalizeOptionalDateToIsoDate(payload.endDate),
  trialEndsAt: normalizeOptionalDateToIsoDate(payload.trialEndsAt),
  renewalDate: normalizeOptionalDateToIsoDate(payload.renewalDate),
  priceAtSubscription: normalizeCurrencyValue(payload.priceAtSubscription),
  blockedReason: payload.blockedReason?.trim() || undefined,
});

export const normalizeSubscriptionUpdatePayload = (
  payload: UpdateSubscriptionRequest,
): UpdateSubscriptionRequest => ({
  ...payload,
  tenantId: payload.tenantId?.trim() || undefined,
  planId: payload.planId?.trim(),
  startDate: normalizeOptionalDateToIsoDate(payload.startDate),
  endDate: normalizeOptionalDateToIsoDate(payload.endDate),
  trialEndsAt: normalizeOptionalDateToIsoDate(payload.trialEndsAt),
  renewalDate: normalizeOptionalDateToIsoDate(payload.renewalDate),
  priceAtSubscription:
    payload.priceAtSubscription === undefined
      ? undefined
      : normalizeCurrencyValue(payload.priceAtSubscription),
  blockedReason: payload.blockedReason?.trim() || undefined,
});
