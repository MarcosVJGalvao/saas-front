import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import {
  translateAcademicYearStatus,
  translateReportCardCalculationType,
  translateReportCardFinalStatusStrategy,
  translateReportCardRecoveryStrategy,
} from '@shared/i18n/pt-BR/enums';

export const academicYearWizardSteps = ['Ano letivo', 'Períodos', 'Boletim'];

export const academicYearStatusOptions: AppSelectOption[] = [
  { label: translateAcademicYearStatus('scheduled'), value: 'scheduled' },
  { label: translateAcademicYearStatus('active'), value: 'active' },
  { label: translateAcademicYearStatus('closed'), value: 'closed' },
];

export const reportCardCalculationTypeOptions: AppSelectOption[] = [
  {
    label: translateReportCardCalculationType('arithmetic'),
    value: 'arithmetic',
  },
  {
    label: translateReportCardCalculationType('weighted'),
    value: 'weighted',
  },
];

export const reportCardRecoveryStrategyOptions: AppSelectOption[] = [
  {
    label: translateReportCardRecoveryStrategy('none'),
    value: 'none',
  },
  {
    label: translateReportCardRecoveryStrategy('replace_lowest'),
    value: 'replace_lowest',
  },
  {
    label: translateReportCardRecoveryStrategy('replace_average'),
    value: 'replace_average',
  },
];

export const reportCardFinalStatusStrategyOptions: AppSelectOption[] = [
  {
    label: translateReportCardFinalStatusStrategy('approval_or_recovery'),
    value: 'approval_or_recovery',
  },
  {
    label: translateReportCardFinalStatusStrategy('approval_recovery_or_failure'),
    value: 'approval_recovery_or_failure',
  },
];
