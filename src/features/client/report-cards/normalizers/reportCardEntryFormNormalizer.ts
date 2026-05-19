import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { ReportCardEntryFormValues } from '@features/client/report-cards/schemas/reportCardEntryFormSchema';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildReportCardEntryInitialValues = (): ReportCardEntryFormValues => ({
  studentEnrollmentId: '',
  subjectId: '',
  academicPeriodId: '',
  assessmentType: '',
  gradeValue: '',
  observations: '',
});

export const normalizeReportCardEntryPayload = (
  values: ReportCardEntryFormValues,
): ClientApiRecord => ({
  studentEnrollmentId: values.studentEnrollmentId.trim(),
  subjectId: values.subjectId.trim(),
  academicPeriodId: values.academicPeriodId.trim(),
  assessmentType: values.assessmentType.trim(),
  gradeValue: Number(values.gradeValue.replace(',', '.')),
  observations: optionalText(values.observations),
});
