import { normalizeCurrencyValue } from '@shared/normalizers/currencyNormalizers';
import type { PlanCreateFormValues } from '@features/platform/plans/schemas/planCreateForm.schema';
import type { PlanEditFormValues } from '@features/platform/plans/schemas/planEditForm.schema';
import type {
  CreatePlanRequest,
  Plan,
  UpdatePlanRequest,
} from '@features/platform/plans/types/plans';

export const toPlanCreatePayload = (values: PlanCreateFormValues): CreatePlanRequest => ({
  name: values.name.trim(),
  description: values.description?.trim() || undefined,
  price: normalizeCurrencyValue(values.price),
  currency: values.currency.trim().toUpperCase(),
  billingCycle: values.billingCycle,
  trialDays: values.trialDays,
  isActive: values.isActive,
});

export const toPlanEditFormValues = (plan: Plan): PlanEditFormValues => ({
  name: plan.name,
  description: plan.description ?? '',
  price: plan.price,
  currency: plan.currency,
  billingCycle: plan.billingCycle,
  trialDays: plan.trialDays,
  isActive: plan.isActive,
});

export const toPlanEditPayload = (values: PlanEditFormValues): UpdatePlanRequest => ({
  name: values.name.trim(),
  description: values.description?.trim() || undefined,
  price: normalizeCurrencyValue(values.price),
  currency: values.currency.trim().toUpperCase(),
  billingCycle: values.billingCycle,
  trialDays: values.trialDays,
  isActive: values.isActive,
});
