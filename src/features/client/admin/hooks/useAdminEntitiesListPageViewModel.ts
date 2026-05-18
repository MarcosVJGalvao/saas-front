import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import {
  buildAdminEntitiesMobileConfig,
  buildAdminEntitiesTableColumns,
} from '@features/client/admin/components/adminEntitiesPresentation';
import { useAdminEntitiesList } from '@features/client/admin/hooks/useAdminEntitiesList';
import type {
  ClientAdminEntity,
  ClientAdminQueryParams,
  ClientAdminStatus,
} from '@features/client/admin/types/admin.types';

type AdminFilterValues = Record<string, unknown>;

type AdminEntitiesListService = {
  list: (params: ClientAdminQueryParams) => Promise<{
    data: ClientAdminEntity[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>;
};

type AdminEntitiesListPageViewModelParams = {
  service: AdminEntitiesListService;
  errorMessageFallback: string;
  routeBase: string;
  showRole?: boolean | undefined;
  showPermissions?: boolean | undefined;
};

const initialFilterValues: AdminFilterValues = {
  query: '',
  status: '',
};

const isAdminStatus = (value: string): value is ClientAdminStatus =>
  value === 'active' || value === 'inactive';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): ClientAdminStatus | undefined => {
  const stringValue = getStringValue(value);
  return isAdminStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: AdminFilterValues,
): Partial<ClientAdminQueryParams> => ({
  search: getOptionalString(filterValues.query),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useAdminEntitiesListPageViewModel = ({
  service,
  errorMessageFallback,
  routeBase,
  showRole = false,
  showPermissions = false,
}: AdminEntitiesListPageViewModelParams) => {
  const navigate = useNavigate();
  const list = useAdminEntitiesList(service, errorMessageFallback);
  const [filterValues, setFilterValues] = useState<AdminFilterValues>(initialFilterValues);

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    list.updateQuery(buildQueryFromFilters(filterValues));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    list.updateQuery({ page: 1, search: undefined, status: undefined });
  };

  const buildRowActions = useCallback(
    (row: ClientAdminEntity): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`${routeBase}/${row.id}`),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void navigate(`${routeBase}/${row.id}/edit`),
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
    columns: buildAdminEntitiesTableColumns({ buildRowActions, showRole, showPermissions }),
    mobileConfig: buildAdminEntitiesMobileConfig({ buildRowActions, showRole, showPermissions }),
  };
};
