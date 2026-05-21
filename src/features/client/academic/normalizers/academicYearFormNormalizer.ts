import type { AcademicYearFormValues } from '@features/client/academic/schemas/academicYearFormSchema';
import {
  type AcademicYear,
  type AcademicYearPeriodInput,
  type AcademicYearUpsertPayload,
} from '@features/client/academic/types/academic.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const parseOptionalNumber = (value: string | undefined): number | undefined => {
  const normalizedValue = optionalText(value);
  return normalizedValue ? Number(normalizedValue.replace(',', '.')) : undefined;
};

const parseRequiredNumber = (value: string): number => Number(value.trim().replace(',', '.'));

const buildDefaultAcademicPeriod = (): AcademicYearFormValues['academicPeriods'][number] => ({
  name: '',
  code: '',
  sequence: '1',
  startDate: '',
  endDate: '',
  weight: '1',
  isFinalPeriod: false,
});

export type AcademicYearSummaryData = Pick<
  AcademicYearFormValues,
  'name' | 'status' | 'academicPeriods' | 'passingGrade' | 'minimumAttendancePercentage'
>;

const normalizeAcademicPeriodFormValues = (
  academicYear: AcademicYear,
): AcademicYearFormValues['academicPeriods'] => {
  const availableAcademicPeriods = academicYear.academicPeriods ?? [];

  if (availableAcademicPeriods.length === 0) {
    return [
      {
        ...buildDefaultAcademicPeriod(),
        startDate: academicYear.startDate ?? '',
        endDate: academicYear.endDate ?? '',
      },
    ];
  }

  return availableAcademicPeriods.map((academicPeriod, periodIndex) => ({
    name: academicPeriod.name,
    code: academicPeriod.code ?? '',
    sequence: String(academicPeriod.sequence ?? periodIndex + 1),
    startDate: academicPeriod.startDate ?? '',
    endDate: academicPeriod.endDate ?? '',
    weight:
      academicPeriod.weight === undefined
        ? ''
        : academicPeriod.weight.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
    isFinalPeriod: academicPeriod.isFinalPeriod === true || academicPeriod.isFinalPeriod === 1,
  }));
};

const toAcademicPeriodPayload = (
  academicPeriod: AcademicYearFormValues['academicPeriods'][number],
): AcademicYearPeriodInput => ({
  name: academicPeriod.name.trim(),
  code: academicPeriod.code.trim(),
  sequence: Number(academicPeriod.sequence.trim()),
  startDate: academicPeriod.startDate,
  endDate: academicPeriod.endDate,
  weight: parseOptionalNumber(academicPeriod.weight),
  isFinalPeriod: academicPeriod.isFinalPeriod,
});

export const buildAcademicYearInitialValues = (): AcademicYearFormValues => ({
  name: '',
  status: 'scheduled',
  startDate: '',
  endDate: '',
  academicPeriods: [buildDefaultAcademicPeriod()],
  calculationType: 'arithmetic',
  passingGrade: '6',
  minimumAttendancePercentage: '75',
  recoveryStrategy: 'replace_average',
  finalStatusStrategy: 'approval_recovery_or_failure',
});

export const normalizeAcademicYearInitialValues = (
  academicYear: AcademicYear,
): AcademicYearFormValues => ({
  name: academicYear.name,
  status: academicYear.status,
  startDate: academicYear.startDate ?? '',
  endDate: academicYear.endDate ?? '',
  academicPeriods: normalizeAcademicPeriodFormValues(academicYear),
  calculationType: academicYear.reportCardPolicy?.calculationType ?? 'arithmetic',
  passingGrade: String(academicYear.reportCardPolicy?.passingGrade ?? 6),
  minimumAttendancePercentage: String(
    academicYear.reportCardPolicy?.minimumAttendancePercentage ?? 75,
  ),
  recoveryStrategy: academicYear.reportCardPolicy?.recoveryStrategy ?? 'replace_average',
  finalStatusStrategy:
    academicYear.reportCardPolicy?.finalStatusStrategy ?? 'approval_recovery_or_failure',
});

export const normalizeAcademicYearPayload = (
  values: AcademicYearFormValues,
): AcademicYearUpsertPayload => ({
  name: values.name.trim(),
  startDate: values.startDate,
  endDate: values.endDate,
  isClosed: values.status === 'closed',
  academicPeriods: values.academicPeriods.map(toAcademicPeriodPayload),
  reportCardPolicy: {
    calculationType: values.calculationType,
    passingGrade: parseRequiredNumber(values.passingGrade),
    minimumAttendancePercentage: parseRequiredNumber(values.minimumAttendancePercentage),
    recoveryStrategy: values.recoveryStrategy,
    finalStatusStrategy: values.finalStatusStrategy,
  },
});

export const buildAcademicYearSummary = (
  values: AcademicYearFormValues,
): AcademicYearSummaryData => ({
  name: values.name,
  status: values.status,
  academicPeriods: values.academicPeriods,
  passingGrade: values.passingGrade,
  minimumAttendancePercentage: values.minimumAttendancePercentage,
});
