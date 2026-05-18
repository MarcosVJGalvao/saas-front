import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import {
  buildSchoolClassesMobileConfig,
  buildSchoolClassesTableColumns,
} from '@features/client/academic/components/schoolClassesListPresentation';
import { useSchoolClassesList } from '@features/client/academic/hooks/useSchoolClassesList';
import type {
  SchoolClass,
  SchoolClassQueryParams,
  SchoolClassShift,
  SchoolClassStatus,
} from '@features/client/academic/types/academic.types';

type SchoolClassFilterValues = Record<string, unknown>;

const initialFilterValues: SchoolClassFilterValues = {
  query: '',
  code: '',
  status: '',
  shift: '',
};

const isSchoolClassStatus = (value: string): value is SchoolClassStatus =>
  value === 'active' || value === 'inactive' || value === 'cancelled';

const isSchoolClassShift = (value: string): value is SchoolClassShift =>
  value === 'morning' || value === 'afternoon' || value === 'evening' || value === 'full_time';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): SchoolClassStatus | undefined => {
  const stringValue = getStringValue(value);
  return isSchoolClassStatus(stringValue) ? stringValue : undefined;
};

const getOptionalShift = (value: unknown): SchoolClassShift | undefined => {
  const stringValue = getStringValue(value);
  return isSchoolClassShift(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: SchoolClassFilterValues,
): Partial<SchoolClassQueryParams> => ({
  search: getOptionalString(filterValues.query),
  name: getOptionalString(filterValues.query),
  code: getOptionalString(filterValues.code),
  status: getOptionalStatus(filterValues.status),
  shift: getOptionalShift(filterValues.shift),
  page: 1,
});

export const useSchoolClassesListPageViewModel = () => {
  const navigate = useNavigate();
  const list = useSchoolClassesList();
  const [filterValues, setFilterValues] = useState<SchoolClassFilterValues>(initialFilterValues);

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    list.updateQuery(buildQueryFromFilters(filterValues));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    list.updateQuery({
      page: 1,
      search: undefined,
      name: undefined,
      code: undefined,
      status: undefined,
      shift: undefined,
    });
  };

  const buildRowActions = useCallback(
    (row: SchoolClass): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/school-classes/${row.id}`),
      },
    ],
    [navigate],
  );

  return {
    list,
    query: list.query.search ?? '',
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    onQueryChange: (search: string) => list.updateQuery({ search, name: search, page: 1 }),
    onPageChange: (page: number) => list.updateQuery({ page }),
    onLimitChange: (limit: number) => list.updateQuery({ limit, page: 1 }),
    columns: buildSchoolClassesTableColumns({ buildRowActions }),
    mobileConfig: buildSchoolClassesMobileConfig({ buildRowActions }),
  };
};
