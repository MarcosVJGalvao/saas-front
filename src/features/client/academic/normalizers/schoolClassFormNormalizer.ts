import type { SchoolClassCreateFormValues } from '@features/client/academic/schemas/schoolClassCreateForm.schema';
import type { SchoolClassEditFormValues } from '@features/client/academic/schemas/schoolClassEditForm.schema';
import type {
  SchoolClass,
  SchoolClassCreateRequest,
  SchoolClassUpdateRequest,
} from '@features/client/academic/types/academic.types';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const optionalNumber = (value: string | undefined): number | undefined => {
  const trimmedValue = value?.trim() ?? '';
  if (trimmedValue.length === 0) {
    return undefined;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

export const buildSchoolClassCreateInitialValues = (): SchoolClassCreateFormValues => ({
  name: '',
  code: '',
  shift: 'morning',
  maxCapacity: 0,
  academicYearId: '',
  gradeId: '',
  coordinatorId: '',
  description: '',
});

export const buildSchoolClassEditInitialValues = (): SchoolClassEditFormValues => ({
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

export const normalizeSchoolClassEditInitialValues = (
  value: SchoolClass,
): SchoolClassEditFormValues => ({
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

export const normalizeSchoolClassCreatePayload = (
  values: SchoolClassCreateFormValues,
): SchoolClassCreateRequest => ({
  name: values.name.trim(),
  code: optionalText(values.code),
  description: optionalText(values.description),
  academicYearId: values.academicYearId.trim(),
  gradeId: values.gradeId.trim(),
  coordinatorId: values.coordinatorId.trim(),
  shift: values.shift,
  maxCapacity: values.maxCapacity,
});

export const normalizeSchoolClassEditPayload = (
  values: SchoolClassEditFormValues,
): SchoolClassUpdateRequest => ({
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
