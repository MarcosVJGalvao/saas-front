import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';
import {
  buildAcademicCatalogMobileConfig,
  buildAcademicCatalogTableColumns,
} from '@features/client/academic/components/academicCatalogListPresentation';
import { useAcademicCatalogList } from '@features/client/academic/hooks/useAcademicCatalogList';
import type {
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
} from '@features/client/academic/types/academic.types';

type AcademicCatalogFilterValues = Record<string, unknown>;

type AcademicCatalogService = Pick<
  ClientCrudService<
    AcademicCatalogItem,
    AcademicCatalogItem,
    Record<string, unknown>,
    Record<string, unknown>,
    AcademicCatalogQueryParams
  >,
  'list'
>;

type AcademicCatalogListPageViewModelParams = {
  service: AcademicCatalogService;
  routeBase: string;
  errorMessageFallback: string;
  showEducationLevel?: boolean | undefined;
};

const initialFilterValues: AcademicCatalogFilterValues = {
  query: '',
  code: '',
  status: '',
};

const isActiveInactiveStatus = (value: string): value is 'active' | 'inactive' =>
  value === 'active' || value === 'inactive';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): 'active' | 'inactive' | undefined => {
  const stringValue = getStringValue(value);
  return isActiveInactiveStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: AcademicCatalogFilterValues,
): Partial<AcademicCatalogQueryParams> => ({
  search: getOptionalString(filterValues.query),
  code: getOptionalString(filterValues.code),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useAcademicCatalogListPageViewModel = ({
  service,
  routeBase,
  errorMessageFallback,
  showEducationLevel = false,
}: AcademicCatalogListPageViewModelParams) => {
  const navigate = useNavigate();
  const list = useAcademicCatalogList(service, errorMessageFallback);
  const [filterValues, setFilterValues] =
    useState<AcademicCatalogFilterValues>(initialFilterValues);

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
      code: undefined,
      status: undefined,
    });
  };

  const buildRowActions = useCallback(
    (row: AcademicCatalogItem): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`${routeBase}/${row.id}`),
      },
    ],
    [navigate, routeBase],
  );

  return {
    list,
    query: list.query.search ?? '',
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    onQueryChange: (search: string) => list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => list.updateQuery({ page }),
    onLimitChange: (limit: number) => list.updateQuery({ limit, page: 1 }),
    columns: buildAcademicCatalogTableColumns({ buildRowActions, showEducationLevel }),
    mobileConfig: buildAcademicCatalogMobileConfig({ buildRowActions, showEducationLevel }),
  };
};
