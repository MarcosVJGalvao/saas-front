import type { FinancialEntityFormValues } from '@features/client/financial/schemas/financialEntityFormSchema';
import type {
  FinancialEntity,
  FinancialEntityPayload,
} from '@features/client/financial/types/financial.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildFinancialEntityInitialValues = (): FinancialEntityFormValues => ({
  name: '',
  code: '',
  type: 'expense',
  status: 'active',
  description: '',
});

export const normalizeFinancialEntityInitialValues = (
  value: FinancialEntity,
): FinancialEntityFormValues => ({
  name: value.name,
  code: value.code ?? '',
  type: 'type' in value ? value.type : 'expense',
  status: value.status ?? 'active',
  description: value.description ?? '',
});

export const normalizeFinancialEntityPayload = (
  values: FinancialEntityFormValues,
  includeType: boolean,
): FinancialEntityPayload => ({
  name: values.name.trim(),
  code: optionalText(values.code),
  type: includeType ? values.type : undefined,
  status: values.status,
  description: optionalText(values.description),
});
