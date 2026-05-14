import { normalizeCurrencyValue } from '@shared/normalizers/currencyNormalizers';
import type { CreatePlanRequest, UpdatePlanRequest } from '@features/plans/types/plans';

export const normalizePlanPayload = (payload: CreatePlanRequest): CreatePlanRequest => ({
  ...payload,
  name: payload.name.trim(),
  description: payload.description?.trim() || undefined,
  price: normalizeCurrencyValue(payload.price),
  currency: payload.currency.trim().toUpperCase(),
});

export const normalizePlanUpdatePayload = (payload: UpdatePlanRequest): UpdatePlanRequest => ({
  ...payload,
  name: payload.name?.trim(),
  description: payload.description?.trim() || undefined,
  price: payload.price === undefined ? undefined : normalizeCurrencyValue(payload.price),
  currency: payload.currency?.trim().toUpperCase(),
});
