import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { translateSchoolClassShift, translateSchoolClassStatus } from '@shared/i18n/pt-BR/enums';

export const schoolClassStatusOptions: AppSelectOption[] = [
  { value: 'active', label: translateSchoolClassStatus('active') },
  { value: 'inactive', label: translateSchoolClassStatus('inactive') },
  { value: 'cancelled', label: translateSchoolClassStatus('cancelled') },
];

export const schoolClassShiftOptions: AppSelectOption[] = [
  { value: 'morning', label: translateSchoolClassShift('morning') },
  { value: 'afternoon', label: translateSchoolClassShift('afternoon') },
  { value: 'evening', label: translateSchoolClassShift('evening') },
  { value: 'full_time', label: translateSchoolClassShift('full_time') },
];
