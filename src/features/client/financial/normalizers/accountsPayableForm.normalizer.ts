import { normalizeCurrencyValue } from '@shared/normalizers/currencyNormalizers';
import type { AccountsPayableCreateFormValues } from '@features/client/financial/schemas/accountsPayableCreateForm.schema';
import type { AccountsPayableEditFormValues } from '@features/client/financial/schemas/accountsPayableEditForm.schema';
import type {
  FinancialRecord,
  FinancialRecordPayload,
} from '@features/client/financial/types/financial.types';

const toOptionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue ? trimmedValue : undefined;
};

const toAmountString = (value: number | undefined): string =>
  value === undefined ? '' : String(value).replace('.', ',');

export const toAccountsPayableCreatePayload = (
  values: AccountsPayableCreateFormValues,
): FinancialRecordPayload => ({
  description: values.description.trim(),
  amount: Number(normalizeCurrencyValue(values.amount)),
  dueDate: values.dueDate,
  status: values.status,
  categoryId: toOptionalText(values.categoryId),
  costCenterId: toOptionalText(values.costCenterId),
});

export const toAccountsPayableEditFormValues = (
  entity: FinancialRecord,
): AccountsPayableEditFormValues => ({
  amount: toAmountString(entity.amount),
  dueDate: entity.dueDate ?? '',
  status: entity.status,
  categoryId: entity.category?.id ?? '',
  costCenterId: entity.costCenter?.id ?? '',
});

export const toAccountsPayableEditPayload = (
  values: AccountsPayableEditFormValues,
): FinancialRecordPayload => ({
  amount: Number(normalizeCurrencyValue(values.amount)),
  dueDate: values.dueDate,
  status: values.status,
  categoryId: toOptionalText(values.categoryId),
  costCenterId: toOptionalText(values.costCenterId),
});
