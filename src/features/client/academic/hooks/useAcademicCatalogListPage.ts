import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildAcademicCatalogColumns,
  buildAcademicCatalogMobileConfig,
} from '@features/client/academic/components/academicCatalogListColumns';
import { useAcademicCatalogList } from '@features/client/academic/hooks/useAcademicCatalogList';
import type {
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
} from '@features/client/academic/types/academic.types';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';

type AcademicCatalogListService = Pick<
  ClientCrudService<
    AcademicCatalogItem,
    AcademicCatalogItem,
    Record<string, unknown>,
    Record<string, unknown>,
    AcademicCatalogQueryParams
  >,
  'list'
>;

type AcademicCatalogFilterValues = {
  query: string;
  code: string;
  status: string;
};

type UseAcademicCatalogListPageParams = {
  service: AcademicCatalogListService;
  routeBase: string;
  errorMessageFallback: string;
  showEducationLevel?: boolean;
};

const initialFilterValues: AcademicCatalogFilterValues = {
  query: '',
  code: '',
  status: '',
};

const isActiveInactiveStatus = (value: string): value is 'active' | 'inactive' =>
  value === 'active' || value === 'inactive';

const getOptionalString = (value: string): string | undefined => {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const getOptionalStatus = (value: string): 'active' | 'inactive' | undefined =>
  isActiveInactiveStatus(value) ? value : undefined;

const buildQueryFromFilters = (
  filterValues: AcademicCatalogFilterValues,
): Partial<AcademicCatalogQueryParams> => ({
  search: getOptionalString(filterValues.query),
  code: getOptionalString(filterValues.code),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useAcademicCatalogListPage = ({
  service,
  routeBase,
  errorMessageFallback,
  showEducationLevel = false,
}: UseAcademicCatalogListPageParams) => {
  const navigate = useNavigate();
  const academicCatalogList = useAcademicCatalogList(service, errorMessageFallback);
  const [filterValues, setFilterValues] =
    useState<AcademicCatalogFilterValues>(initialFilterValues);

  return {
    academicCatalogList,
    filterValues,
    onFilterChange: (filterKey: string, filterValue: unknown) => {
      const normalizedValue = typeof filterValue === 'string' ? filterValue : '';
      if (filterKey === 'query' || filterKey === 'code' || filterKey === 'status') {
        setFilterValues((currentValues) => ({ ...currentValues, [filterKey]: normalizedValue }));
      }
    },
    applyFilters: () => {
      academicCatalogList.updateQuery(buildQueryFromFilters(filterValues));
    },
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      academicCatalogList.updateQuery({
        page: 1,
        search: undefined,
        code: undefined,
        status: undefined,
      });
    },
    tableColumns: buildAcademicCatalogColumns({
      actions: {
        onDetails: (item) => {
          void navigate(`${routeBase}/${item.id}`);
        },
        onEdit: (item) => {
          void navigate(`${routeBase}/${item.id}/edit`, {
            state: { entity: item },
          });
        },
      },
      showEducationLevel,
    }),
    mobileConfig: buildAcademicCatalogMobileConfig({
      actions: {
        onDetails: (item) => {
          void navigate(`${routeBase}/${item.id}`);
        },
        onEdit: (item) => {
          void navigate(`${routeBase}/${item.id}/edit`, {
            state: { entity: item },
          });
        },
      },
      showEducationLevel,
    }),
  };
};
