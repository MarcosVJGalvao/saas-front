import type { SchoolClassFormValues } from '@features/client/academic/schemas/schoolClassFormSchema';
import type { SchoolClass } from '@features/client/academic/types/academic.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const optionalNumber = (value: string | undefined): number | undefined => {
  const trimmedValue = value?.trim() ?? '';
  if (!trimmedValue) return undefined;
  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

export const buildSchoolClassInitialValues = (): SchoolClassFormValues => ({
  name: '',
  code: '',
  status: 'active',
  shift: 'morning',
  capacity: '',
  academicYearId: '',
  gradeId: '',
  educationLevelId: '',
  description: '',
});

export const normalizeSchoolClassInitialValues = (value: SchoolClass): SchoolClassFormValues => ({
  name: value.name,
  code: value.code ?? '',
  status: value.status,
  shift: value.shift ?? 'morning',
  capacity: value.maxCapacity !== undefined ? String(value.maxCapacity) : '',
  academicYearId: value.academicYear?.id ?? '',
  gradeId: value.grade?.id ?? '',
  educationLevelId: value.educationLevel?.id ?? '',
  description: value.description ?? '',
});

export const normalizeSchoolClassPayload = (
  values: SchoolClassFormValues,
): Record<string, unknown> => ({
  name: values.name.trim(),
  code: optionalText(values.code),
  status: values.status,
  shift: values.shift,
  maxCapacity: optionalNumber(values.capacity),
  academicYearId: values.academicYearId.trim(),
  gradeId: values.gradeId.trim(),
  educationLevelId: optionalText(values.educationLevelId),
  description: optionalText(values.description),
});
