import type { AcademicYearFormValues } from '@features/client/academic/schemas/academicYearFormSchema';
import type { AcademicYear } from '@features/client/academic/types/academic.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const optionalNumber = (value: string | undefined): number | undefined => {
  const normalizedValue = optionalText(value);
  return normalizedValue ? Number(normalizedValue.replace(',', '.')) : undefined;
};

const requiredNumber = (value: string): number => Number(value.trim().replace(',', '.'));

const parseBooleanText = (value: string | undefined): boolean | undefined => {
  const normalizedValue = optionalText(value)?.toLowerCase();
  if (normalizedValue === 'true' || normalizedValue === 'sim') return true;
  if (normalizedValue === 'false' || normalizedValue === 'não' || normalizedValue === 'nao') {
    return false;
  }
  return undefined;
};

export const buildAcademicYearInitialValues = (): AcademicYearFormValues => ({
  name: '',
  status: 'scheduled',
  startDate: '',
  endDate: '',
  periodName: '1º período',
  periodCode: 'P1',
  periodSequence: '1',
  periodStartDate: '',
  periodEndDate: '',
  periodWeight: '1',
  periodIsFinal: 'false',
  calculationType: 'weighted',
  passingGrade: '6',
  minimumAttendancePercentage: '75',
  recoveryStrategy: 'replace_average',
  finalStatusStrategy: 'approval_recovery_or_failure',
  description: '',
});

export const normalizeAcademicYearInitialValues = (
  value: AcademicYear,
): AcademicYearFormValues => ({
  name: value.name,
  status: value.status,
  startDate: value.startDate ?? '',
  endDate: value.endDate ?? '',
  periodName: '1º período',
  periodCode: 'P1',
  periodSequence: '1',
  periodStartDate: value.startDate ?? '',
  periodEndDate: value.endDate ?? '',
  periodWeight: '1',
  periodIsFinal: 'false',
  calculationType: 'weighted',
  passingGrade: '6',
  minimumAttendancePercentage: '75',
  recoveryStrategy: 'replace_average',
  finalStatusStrategy: 'approval_recovery_or_failure',
  description: value.description ?? '',
});

export const normalizeAcademicYearPayload = (
  values: AcademicYearFormValues,
): Record<string, unknown> => ({
  name: values.name.trim(),
  startDate: values.startDate,
  endDate: values.endDate,
  isClosed: values.status === 'closed',
  academicPeriods: [
    {
      name: values.periodName.trim(),
      code: values.periodCode.trim(),
      sequence: requiredNumber(values.periodSequence),
      startDate: values.periodStartDate,
      endDate: values.periodEndDate,
      weight: optionalNumber(values.periodWeight),
      isFinalPeriod: parseBooleanText(values.periodIsFinal),
    },
  ],
  reportCardPolicy: {
    calculationType: values.calculationType.trim(),
    passingGrade: requiredNumber(values.passingGrade),
    minimumAttendancePercentage: requiredNumber(values.minimumAttendancePercentage),
    recoveryStrategy: values.recoveryStrategy.trim(),
    finalStatusStrategy: values.finalStatusStrategy.trim(),
  },
  description: optionalText(values.description),
});
