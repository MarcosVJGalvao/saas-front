import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import {
  academicYearStatusLabels,
  activeInactiveStatusLabels,
  attendanceStatusLabels,
  documentTypeLabels,
  employeeJobTitleLabels,
  financialCategoryTypeLabels,
  financialEntityStatusLabels,
  financialRecordStatusLabels,
  genderLabels,
  guardianRelationshipTypeLabels,
  maritalStatusLabels,
  nationalityLabels,
  paymentMethodLabels,
  reportCardCalculationTypeLabels,
  reportCardAssessmentTypeLabels,
  reportCardFinalStatusStrategyLabels,
  reportCardRecoveryStrategyLabels,
  schoolClassShiftLabels,
  schoolClassStatusLabels,
  studentStatusLabels,
} from '@shared/i18n/pt-BR/enums';
import { commonLabels } from '@shared/i18n/pt-BR/labels';

type SelectOptionValue = AppSelectOption['value'];

const buildSelectOption = (value: SelectOptionValue, label: string): AppSelectOption => ({
  value,
  label,
});

const buildPlaceholderOption = (): AppSelectOption => buildSelectOption('', commonLabels.select);

const withPlaceholder = (options: AppSelectOption[]): AppSelectOption[] => [
  buildPlaceholderOption(),
  ...options,
];

export const activeInactiveStatusOptions: AppSelectOption[] = [
  buildSelectOption('active', activeInactiveStatusLabels.active),
  buildSelectOption('inactive', activeInactiveStatusLabels.inactive),
];

export const academicYearStatusOptions: AppSelectOption[] = [
  buildSelectOption('scheduled', academicYearStatusLabels.scheduled),
  buildSelectOption('active', academicYearStatusLabels.active),
  buildSelectOption('closed', academicYearStatusLabels.closed),
];

export const attendanceStatusOptions: AppSelectOption[] = [
  buildSelectOption('present', attendanceStatusLabels.present),
  buildSelectOption('absent', attendanceStatusLabels.absent),
  buildSelectOption('justified', attendanceStatusLabels.justified),
];

export const attendanceWeekdayOptions: AppSelectOption[] = [
  buildSelectOption('Segunda-feira', 'Segunda-feira'),
  buildSelectOption('Terça-feira', 'Terça-feira'),
  buildSelectOption('Quarta-feira', 'Quarta-feira'),
  buildSelectOption('Quinta-feira', 'Quinta-feira'),
  buildSelectOption('Sexta-feira', 'Sexta-feira'),
  buildSelectOption('Sábado', 'Sábado'),
  buildSelectOption('Domingo', 'Domingo'),
];

export const documentTypeOptions: AppSelectOption[] = [
  buildSelectOption('CPF', documentTypeLabels.CPF),
  buildSelectOption('CNPJ', documentTypeLabels.CNPJ),
  buildSelectOption('RG', documentTypeLabels.RG),
  buildSelectOption('PASSPORT', documentTypeLabels.PASSPORT),
  buildSelectOption('OTHER', documentTypeLabels.OTHER),
];

export const documentTypeOptionsWithPlaceholder = withPlaceholder(documentTypeOptions);

export const genderOptions: AppSelectOption[] = [
  buildSelectOption('male', genderLabels.male),
  buildSelectOption('female', genderLabels.female),
  buildSelectOption('other', genderLabels.other),
  buildSelectOption('prefer_not_to_say', genderLabels.prefer_not_to_say),
];

export const genderOptionsWithPlaceholder = withPlaceholder(genderOptions);

export const maritalStatusOptions: AppSelectOption[] = [
  buildSelectOption('single', maritalStatusLabels.single),
  buildSelectOption('married', maritalStatusLabels.married),
  buildSelectOption('divorced', maritalStatusLabels.divorced),
  buildSelectOption('widowed', maritalStatusLabels.widowed),
  buildSelectOption('other', maritalStatusLabels.other),
];

export const maritalStatusOptionsWithPlaceholder = withPlaceholder(maritalStatusOptions);

export const nationalityOptions: AppSelectOption[] = [
  buildSelectOption('brazilian', nationalityLabels.brazilian),
  buildSelectOption('foreign', nationalityLabels.foreign),
  buildSelectOption('other', nationalityLabels.other),
];

export const guardianRelationshipTypeOptions: AppSelectOption[] = [
  buildSelectOption('mother', guardianRelationshipTypeLabels.mother),
  buildSelectOption('father', guardianRelationshipTypeLabels.father),
  buildSelectOption('legal_guardian', guardianRelationshipTypeLabels.legal_guardian),
  buildSelectOption('grandparent', guardianRelationshipTypeLabels.grandparent),
  buildSelectOption('other', guardianRelationshipTypeLabels.other),
];

export const paymentMethodOptions: AppSelectOption[] = [
  buildSelectOption('cash', paymentMethodLabels.cash),
  buildSelectOption('pix', paymentMethodLabels.pix),
  buildSelectOption('credit_card', paymentMethodLabels.credit_card),
  buildSelectOption('debit_card', paymentMethodLabels.debit_card),
  buildSelectOption('bank_transfer', paymentMethodLabels.bank_transfer),
  buildSelectOption('bank_slip', paymentMethodLabels.bank_slip),
  buildSelectOption('other', paymentMethodLabels.other),
];

export const financialCategoryTypeOptions: AppSelectOption[] = [
  buildSelectOption('revenue', financialCategoryTypeLabels.revenue),
  buildSelectOption('expense', financialCategoryTypeLabels.expense),
];

export const financialEntityStatusOptions: AppSelectOption[] = [
  buildSelectOption('active', financialEntityStatusLabels.active),
  buildSelectOption('inactive', financialEntityStatusLabels.inactive),
];

export const financialRecordStatusOptions: AppSelectOption[] = [
  buildSelectOption('open', financialRecordStatusLabels.open),
  buildSelectOption('partially_paid', financialRecordStatusLabels.partially_paid),
  buildSelectOption('paid', financialRecordStatusLabels.paid),
  buildSelectOption('received', financialRecordStatusLabels.received),
  buildSelectOption('overdue', financialRecordStatusLabels.overdue),
  buildSelectOption('cancelled', financialRecordStatusLabels.cancelled),
  buildSelectOption('reversed', financialRecordStatusLabels.reversed),
];

export const reportCardAssessmentTypeOptions: AppSelectOption[] = [
  buildSelectOption('regular', reportCardAssessmentTypeLabels.regular),
  buildSelectOption('recovery', reportCardAssessmentTypeLabels.recovery),
  buildSelectOption('final', reportCardAssessmentTypeLabels.final),
  buildSelectOption('other', reportCardAssessmentTypeLabels.other),
];

export const reportCardCalculationTypeOptions: AppSelectOption[] = [
  buildSelectOption('arithmetic', reportCardCalculationTypeLabels.arithmetic),
  buildSelectOption('weighted', reportCardCalculationTypeLabels.weighted),
];

export const reportCardRecoveryStrategyOptions: AppSelectOption[] = [
  buildSelectOption('none', reportCardRecoveryStrategyLabels.none),
  buildSelectOption('replace_lowest', reportCardRecoveryStrategyLabels.replace_lowest),
  buildSelectOption('replace_average', reportCardRecoveryStrategyLabels.replace_average),
];

export const reportCardFinalStatusStrategyOptions: AppSelectOption[] = [
  buildSelectOption(
    'approval_or_recovery',
    reportCardFinalStatusStrategyLabels.approval_or_recovery,
  ),
  buildSelectOption(
    'approval_recovery_or_failure',
    reportCardFinalStatusStrategyLabels.approval_recovery_or_failure,
  ),
];

export const schoolClassStatusOptions: AppSelectOption[] = [
  buildSelectOption('active', schoolClassStatusLabels.active),
  buildSelectOption('inactive', schoolClassStatusLabels.inactive),
  buildSelectOption('cancelled', schoolClassStatusLabels.cancelled),
];

export const schoolClassShiftOptions: AppSelectOption[] = [
  buildSelectOption('morning', schoolClassShiftLabels.morning),
  buildSelectOption('afternoon', schoolClassShiftLabels.afternoon),
  buildSelectOption('evening', schoolClassShiftLabels.evening),
  buildSelectOption('full_time', schoolClassShiftLabels.full_time),
];

export const studentStatusOptions: AppSelectOption[] = [
  buildSelectOption('active', studentStatusLabels.active),
  buildSelectOption('inactive', studentStatusLabels.inactive),
  buildSelectOption('cancelled', studentStatusLabels.cancelled),
];

export const employeeJobTitleOptions: AppSelectOption[] = [
  buildSelectOption('teacher', employeeJobTitleLabels.teacher),
  buildSelectOption('teaching_assistant', employeeJobTitleLabels.teaching_assistant),
  buildSelectOption('coordinator', employeeJobTitleLabels.coordinator),
  buildSelectOption('director', employeeJobTitleLabels.director),
  buildSelectOption('secretary', employeeJobTitleLabels.secretary),
  buildSelectOption('financial', employeeJobTitleLabels.financial),
  buildSelectOption('administrator', employeeJobTitleLabels.administrator),
  buildSelectOption('administrative', employeeJobTitleLabels.administrative),
  buildSelectOption('assistant', employeeJobTitleLabels.assistant),
  buildSelectOption('other', employeeJobTitleLabels.other),
];

export const employeeJobTitleOptionsWithPlaceholder = withPlaceholder(employeeJobTitleOptions);
export const yesNoOptions: AppSelectOption[] = [
  buildSelectOption('', 'Não informar'),
  buildSelectOption('true', 'Sim'),
  buildSelectOption('false', 'Não'),
];

export const createOptionsWithPlaceholder = withPlaceholder;
