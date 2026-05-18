import type { AcademicCatalogFormValues } from '@features/client/academic/schemas/academicCatalogFormSchema';

const optionalText = (value: string | undefined): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const buildAcademicCatalogInitialValues = (): AcademicCatalogFormValues => ({
  name: '',
  code: '',
  status: 'active',
  description: '',
  educationLevelId: '',
});

export const normalizeAcademicCatalogInitialValues = (value: {
  name?: string | undefined;
  code?: string | undefined;
  status?: 'active' | 'inactive' | undefined;
  description?: string | undefined;
  educationLevel?: { id: string } | null | undefined;
}): AcademicCatalogFormValues => ({
  name: value.name ?? '',
  code: value.code ?? '',
  status: value.status ?? 'active',
  description: value.description ?? '',
  educationLevelId: value.educationLevel?.id ?? '',
});

export const normalizeAcademicCatalogPayload = (
  values: AcademicCatalogFormValues,
): Record<string, unknown> => ({
  name: values.name.trim(),
  code: optionalText(values.code),
  status: values.status,
  description: optionalText(values.description),
  educationLevelId: optionalText(values.educationLevelId),
});
