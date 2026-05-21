import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import {
  translateFinancialCategoryType,
  translateFinancialEntityStatus,
  translateFinancialRecordStatus,
} from '@shared/i18n/pt-BR/enums';

export const financialRecordStatusOptions: AppSelectOption[] = [
  { value: 'open', label: translateFinancialRecordStatus('open') },
  { value: 'partially_paid', label: translateFinancialRecordStatus('partially_paid') },
  { value: 'paid', label: translateFinancialRecordStatus('paid') },
  { value: 'received', label: translateFinancialRecordStatus('received') },
  { value: 'overdue', label: translateFinancialRecordStatus('overdue') },
  { value: 'cancelled', label: translateFinancialRecordStatus('cancelled') },
  { value: 'reversed', label: translateFinancialRecordStatus('reversed') },
];

export const financialEntityStatusOptions: AppSelectOption[] = [
  { value: 'active', label: translateFinancialEntityStatus('active') },
  { value: 'inactive', label: translateFinancialEntityStatus('inactive') },
];

export const financialCategoryTypeOptions: AppSelectOption[] = [
  { value: 'revenue', label: translateFinancialCategoryType('revenue') },
  { value: 'expense', label: translateFinancialCategoryType('expense') },
];
