import type { FinancialCostCenterCreateFormValues } from '@features/client/financial/schemas/financialCostCenterCreateForm.schema';
import type { FinancialCostCenterEditFormValues } from '@features/client/financial/schemas/financialCostCenterEditForm.schema';
import type {
  FinancialCostCenter,
  FinancialEntityPayload,
} from '@features/client/financial/types/financial.types';

const toOptionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue ? trimmedValue : undefined;
};

export const toFinancialCostCenterCreatePayload = (
  values: FinancialCostCenterCreateFormValues,
): Omit<FinancialEntityPayload, 'status'> => ({
  name: values.name.trim(),
  code: toOptionalText(values.code),
  description: toOptionalText(values.description),
});

export const toFinancialCostCenterEditFormValues = (
  entity: FinancialCostCenter,
): FinancialCostCenterEditFormValues => ({
  code: entity.code ?? '',
  status: entity.status ?? 'active',
  description: entity.description ?? '',
});

export const toFinancialCostCenterEditPayload = (
  values: FinancialCostCenterEditFormValues,
): Partial<FinancialEntityPayload> => ({
  code: toOptionalText(values.code),
  status: values.status,
  description: toOptionalText(values.description),
});
