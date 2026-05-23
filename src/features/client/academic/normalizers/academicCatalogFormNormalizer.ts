import type { AcademicCatalogCreateFormValues } from '@features/client/academic/schemas/academicCatalogCreateForm.schema';
import type { AcademicCatalogEditFormValues } from '@features/client/academic/schemas/academicCatalogEditForm.schema';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

type AcademicCatalogFormValues = AcademicCatalogCreateFormValues | AcademicCatalogEditFormValues;

export const buildAcademicCatalogInitialValues = (): AcademicCatalogCreateFormValues => ({
  name: '',
  code: '',
  status: 'active',
  description: '',
  educationLevelId: '',
});

export const toAcademicCatalogEditFormValues = (value: {
  name?: string | undefined;
  code?: string | undefined;
  status?: 'active' | 'inactive' | undefined;
  description?: string | undefined;
  educationLevel?: { id: string } | null | undefined;
}): AcademicCatalogEditFormValues => ({
  name: value.name ?? '',
  code: value.code ?? '',
  status: value.status ?? 'active',
  description: value.description ?? '',
  educationLevelId: value.educationLevel?.id ?? '',
});

const toAcademicCatalogPayload = (values: AcademicCatalogFormValues): Record<string, unknown> => ({
  name: values.name.trim(),
  code: optionalText(values.code),
  status: values.status,
  description: optionalText(values.description),
  educationLevelId: optionalText(values.educationLevelId),
});

export const toAcademicCatalogCreatePayload = (
  values: AcademicCatalogCreateFormValues,
): Record<string, unknown> => toAcademicCatalogPayload(values);

export const toEducationLevelCreatePayload = (
  values: AcademicCatalogCreateFormValues,
): Record<string, unknown> => ({
  name: values.name.trim(),
  description: optionalText(values.description),
});

export const toGradeCreatePayload = (
  values: AcademicCatalogCreateFormValues,
): Record<string, unknown> => ({
  name: values.name.trim(),
  code: optionalText(values.code),
  description: optionalText(values.description),
  educationLevelId: optionalText(values.educationLevelId),
});

export const toAcademicCatalogEditPayload = (
  values: AcademicCatalogEditFormValues,
): Record<string, unknown> => toAcademicCatalogPayload(values);
