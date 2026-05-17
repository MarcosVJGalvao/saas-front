import type { FilterField } from '@shared/components/data-display/data/listFilters.types';

const fieldTypePriority: Record<FilterField['type'], number> = {
  text: 1,
  select: 2,
  date: 3,
  dateRange: 4,
};

export const toStringValue = (value: unknown): string => (typeof value === 'string' ? value : '');

export const toDateValue = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null;

export const resolveMobilePriority = (field: FilterField): number =>
  field.mobileOrder ?? fieldTypePriority[field.type];

export const buildMobileOrderMap = (fields: FilterField[]): Map<string, number> => {
  const orderedFields = [...fields].sort(
    (leftField, rightField) => resolveMobilePriority(leftField) - resolveMobilePriority(rightField),
  );

  return new Map(
    orderedFields.map((orderedField, orderedIndex) => [orderedField.name, orderedIndex + 1]),
  );
};
