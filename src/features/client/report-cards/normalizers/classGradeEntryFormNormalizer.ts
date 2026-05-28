import type { ClassGradeEntryFormValues } from '@features/client/report-cards/schemas/classGradeEntry/classGradeEntryFormSchema';
import type { ClassGradeEntryPayload } from '@features/client/report-cards/services/types';

const trimmedOrUndefined = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : undefined;
};

export const toClassGradeEntryPayload = (
  values: ClassGradeEntryFormValues,
): ClassGradeEntryPayload => ({
  teacherSubjectId: values.teacherSubjectId.trim(),
  academicPeriodId: values.academicPeriodId.trim(),
  assessmentType: values.assessmentType.trim(),
  entries: values.entries.map((entry) => {
    const observations = trimmedOrUndefined(entry.observations);
    return {
      studentEnrollmentId: entry.studentEnrollmentId.trim(),
      gradeValue: parseFloat(entry.gradeValue.replace(',', '.')),
      ...(observations !== undefined && { observations }),
    };
  }),
});
