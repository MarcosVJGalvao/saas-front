import type { ReportCardAcademicPeriodCreateFormValues } from '@features/client/report-cards/schemas/reportCardAcademicPeriodCreateForm.schema';
import type { ReportCardGradeSubjectCreateFormValues } from '@features/client/report-cards/schemas/reportCardGradeSubjectCreateForm.schema';

const getOptionalString = (value: string): string | undefined => {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const getRequiredString = (value: string): string => value.trim();

const getRequiredNumber = (value: string): number => Number(value.trim().replace(',', '.'));

const getOptionalBoolean = (value: string): boolean | undefined => {
  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue) {
    return undefined;
  }
  if (normalizedValue === 'true' || normalizedValue === 'sim') {
    return true;
  }
  if (normalizedValue === 'false' || normalizedValue === 'não' || normalizedValue === 'nao') {
    return false;
  }
  return undefined;
};

export const buildReportCardAcademicPeriodInitialValues =
  (): ReportCardAcademicPeriodCreateFormValues => ({
    academicYearId: '',
    name: '',
    code: '',
    sequence: '',
    startDate: '',
    endDate: '',
    weight: '',
    isFinalPeriod: '',
  });

export const buildReportCardGradeSubjectInitialValues =
  (): ReportCardGradeSubjectCreateFormValues => ({
    academicYearId: '',
    gradeId: '',
    subjectId: '',
    workloadHours: '',
    displayOrder: '',
    isMandatory: '',
  });

export const toReportCardAcademicPeriodCreatePayload = (
  values: ReportCardAcademicPeriodCreateFormValues,
): Record<string, unknown> => ({
  academicYearId: getRequiredString(values.academicYearId),
  name: getRequiredString(values.name),
  code: getOptionalString(values.code ?? ''),
  sequence: getRequiredNumber(values.sequence),
  startDate: getRequiredString(values.startDate),
  endDate: getRequiredString(values.endDate),
  weight: getRequiredNumber(values.weight),
  isFinalPeriod: getOptionalBoolean(values.isFinalPeriod ?? ''),
});

export const toReportCardGradeSubjectCreatePayload = (
  values: ReportCardGradeSubjectCreateFormValues,
): Record<string, unknown> => ({
  academicYearId: getRequiredString(values.academicYearId),
  gradeId: getRequiredString(values.gradeId),
  subjectId: getRequiredString(values.subjectId),
  workloadHours: getRequiredNumber(values.workloadHours),
  displayOrder: getRequiredNumber(values.displayOrder),
  isMandatory: getOptionalBoolean(values.isMandatory ?? ''),
});
