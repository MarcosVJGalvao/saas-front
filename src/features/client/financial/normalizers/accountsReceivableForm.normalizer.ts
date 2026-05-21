import { normalizeCurrencyValue } from '@shared/normalizers/currencyNormalizers';
import type { AccountsReceivableCreateFormValues } from '@features/client/financial/schemas/accountsReceivableCreateForm.schema';
import type { AccountsReceivableEditFormValues } from '@features/client/financial/schemas/accountsReceivableEditForm.schema';
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

export const toAccountsReceivableCreatePayload = (
  values: AccountsReceivableCreateFormValues,
): FinancialRecordPayload => ({
  description: values.description.trim(),
  amount: Number(normalizeCurrencyValue(values.amount)),
  dueDate: values.dueDate,
  status: values.status,
  categoryId: toOptionalText(values.categoryId),
  costCenterId: toOptionalText(values.costCenterId),
  studentId: toOptionalText(values.studentId),
});

export const toAccountsReceivableEditFormValues = (
  entity: FinancialRecord,
): AccountsReceivableEditFormValues => ({
  amount: toAmountString(entity.amount),
  dueDate: entity.dueDate ?? '',
  status: entity.status,
  categoryId: entity.category?.id ?? '',
  costCenterId: entity.costCenter?.id ?? '',
  studentId: entity.student?.id ?? '',
});

export const toAccountsReceivableEditPayload = (
  values: AccountsReceivableEditFormValues,
): FinancialRecordPayload => ({
  amount: Number(normalizeCurrencyValue(values.amount)),
  dueDate: values.dueDate,
  status: values.status,
  categoryId: toOptionalText(values.categoryId),
  costCenterId: toOptionalText(values.costCenterId),
  studentId: toOptionalText(values.studentId),
});
