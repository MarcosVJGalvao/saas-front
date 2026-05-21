import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { reportCardAssessmentTypeLabels } from '@shared/i18n/pt-BR/enums';

export const reportCardAssessmentTypeOptions: AppSelectOption[] = [
  { value: 'regular', label: reportCardAssessmentTypeLabels.regular },
  { value: 'recovery', label: reportCardAssessmentTypeLabels.recovery },
  { value: 'final', label: reportCardAssessmentTypeLabels.final },
  { value: 'other', label: reportCardAssessmentTypeLabels.other },
];

export const yesNoOptions: AppSelectOption[] = [
  { value: '', label: 'Não informar' },
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' },
];
