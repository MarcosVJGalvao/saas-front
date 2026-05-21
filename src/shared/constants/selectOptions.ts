import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import {
  activeInactiveStatusLabels,
  paymentMethodLabels,
  reportCardAssessmentTypeLabels,
} from '@shared/i18n/pt-BR/enums';

export const activeInactiveStatusOptions: AppSelectOption[] = [
  { value: 'active', label: activeInactiveStatusLabels.active },
  { value: 'inactive', label: activeInactiveStatusLabels.inactive },
];

export const paymentMethodOptions: AppSelectOption[] = [
  { value: 'cash', label: paymentMethodLabels.cash },
  { value: 'pix', label: paymentMethodLabels.pix },
  { value: 'credit_card', label: paymentMethodLabels.credit_card },
  { value: 'debit_card', label: paymentMethodLabels.debit_card },
  { value: 'bank_transfer', label: paymentMethodLabels.bank_transfer },
  { value: 'bank_slip', label: paymentMethodLabels.bank_slip },
  { value: 'other', label: paymentMethodLabels.other },
];

export const reportCardAssessmentTypeOptions: AppSelectOption[] = [
  { value: 'regular', label: reportCardAssessmentTypeLabels.regular },
  { value: 'recovery', label: reportCardAssessmentTypeLabels.recovery },
  { value: 'final', label: reportCardAssessmentTypeLabels.final },
  { value: 'other', label: reportCardAssessmentTypeLabels.other },
];
