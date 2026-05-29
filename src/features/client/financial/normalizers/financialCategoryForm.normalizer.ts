import type { FinancialCategoryCreateFormValues } from '@features/client/financial/schemas/financialCategoryCreateForm.schema';
import type { FinancialCategoryEditFormValues } from '@features/client/financial/schemas/financialCategoryEditForm.schema';
import type {
  FinancialCategory,
  FinancialEntityPayload,
} from '@features/client/financial/types/financial.types';

const toOptionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue ? trimmedValue : undefined;
};

export const toFinancialCategoryCreatePayload = (
  values: FinancialCategoryCreateFormValues,
): Omit<FinancialEntityPayload, 'status'> => ({
  name: values.name.trim(),
  code: toOptionalText(values.code),
  type: values.type,
  description: toOptionalText(values.description),
});

export const toFinancialCategoryEditFormValues = (
  entity: FinancialCategory,
): FinancialCategoryEditFormValues => ({
  code: entity.code ?? '',
  type: entity.type,
  status: entity.status ?? 'active',
  description: entity.description ?? '',
});

export const toFinancialCategoryEditPayload = (
  values: FinancialCategoryEditFormValues,
): Partial<FinancialEntityPayload> => ({
  code: toOptionalText(values.code),
  type: values.type,
  status: values.status,
  description: toOptionalText(values.description),
});
