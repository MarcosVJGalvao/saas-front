import { normalizeCurrencyValue } from '@shared/normalizers/currencyNormalizers';
import type { FinancialRecordFormValues } from '@features/client/financial/schemas/financialRecordFormSchema';
import type {
  FinancialRecord,
  FinancialRecordPayload,
} from '@features/client/financial/types/financial.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const formatAmount = (value: number | undefined): string =>
  value === undefined ? '' : String(value).replace('.', ',');

export const buildFinancialRecordInitialValues = (): FinancialRecordFormValues => ({
  description: '',
  amount: '',
  dueDate: '',
  status: 'open',
  categoryId: '',
  costCenterId: '',
  studentId: '',
});

export const normalizeFinancialRecordInitialValues = (
  value: FinancialRecord,
): FinancialRecordFormValues => ({
  description: value.description ?? value.name ?? '',
  amount: formatAmount(value.amount),
  dueDate: value.dueDate ?? '',
  status: value.status,
  categoryId: value.category?.id ?? '',
  costCenterId: value.costCenter?.id ?? '',
  studentId: value.student?.id ?? '',
});

export const normalizeFinancialRecordPayload = (
  values: FinancialRecordFormValues,
  includeStudent: boolean,
): FinancialRecordPayload => ({
  description: values.description.trim(),
  amount: Number(normalizeCurrencyValue(values.amount)),
  dueDate: values.dueDate,
  status: values.status,
  categoryId: optionalText(values.categoryId),
  costCenterId: optionalText(values.costCenterId),
  studentId: includeStudent ? optionalText(values.studentId) : undefined,
});
