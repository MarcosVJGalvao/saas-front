import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildSchoolClassColumns,
  buildSchoolClassMobileConfig,
} from '@features/client/academic/components/schoolClassListColumns';
import { useSchoolClassesList } from '@features/client/academic/hooks/useSchoolClassesList';
import type {
  SchoolClassQueryParams,
  SchoolClassShift,
  SchoolClassStatus,
} from '@features/client/academic/types/academic.types';

type SchoolClassFilterValues = {
  query: string;
  code: string;
  status: string;
  shift: string;
};

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

const getOptionalString = (value: string): string | undefined => {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const getOptionalStatus = (value: string): SchoolClassStatus | undefined =>
  isSchoolClassStatus(value) ? value : undefined;

const getOptionalShift = (value: string): SchoolClassShift | undefined =>
  isSchoolClassShift(value) ? value : undefined;

const buildQueryFromFilters = (
  filterValues: SchoolClassFilterValues,
): Partial<SchoolClassQueryParams> => ({
  search: getOptionalString(filterValues.query),
  code: getOptionalString(filterValues.code),
  status: getOptionalStatus(filterValues.status),
  shift: getOptionalShift(filterValues.shift),
  page: 1,
});

export const useSchoolClassesListPage = () => {
  const navigate = useNavigate();
  const schoolClassesList = useSchoolClassesList();
  const [filterValues, setFilterValues] = useState<SchoolClassFilterValues>(initialFilterValues);

  return {
    schoolClassesList,
    filterValues,
    onFilterChange: (filterKey: string, filterValue: unknown) => {
      const normalizedValue = typeof filterValue === 'string' ? filterValue : '';
      if (
        filterKey === 'query' ||
        filterKey === 'code' ||
        filterKey === 'status' ||
        filterKey === 'shift'
      ) {
        setFilterValues((currentValues) => ({ ...currentValues, [filterKey]: normalizedValue }));
      }
    },
    applyFilters: () => {
      schoolClassesList.updateQuery(buildQueryFromFilters(filterValues));
    },
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      schoolClassesList.updateQuery({
        page: 1,
        search: undefined,
        code: undefined,
        status: undefined,
        shift: undefined,
      });
    },
    tableColumns: buildSchoolClassColumns({
      onDetails: (schoolClass) => {
        void navigate(`/client/school-classes/${schoolClass.id}`);
      },
      onEdit: (schoolClass) => {
        void navigate(`/client/school-classes/${schoolClass.id}/edit`, {
          state: { entity: schoolClass },
        });
      },
    }),
    mobileConfig: buildSchoolClassMobileConfig({
      onDetails: (schoolClass) => {
        void navigate(`/client/school-classes/${schoolClass.id}`);
      },
      onEdit: (schoolClass) => {
        void navigate(`/client/school-classes/${schoolClass.id}/edit`, {
          state: { entity: schoolClass },
        });
      },
    }),
  };
};
