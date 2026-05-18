import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';
import {
  buildFinancialEntitiesMobileConfig,
  buildFinancialEntitiesTableColumns,
} from '@features/client/financial/components/financialEntitiesPresentation';
import { useFinancialEntitiesList } from '@features/client/financial/hooks/useFinancialEntitiesList';
import type {
  FinancialCategoryType,
  FinancialEntity,
  FinancialEntityPayload,
  FinancialEntityQueryParams,
  FinancialEntityStatus,
} from '@features/client/financial/types/financial.types';

type FinancialEntityFilterValues = Record<string, unknown>;

type FinancialEntitiesListService = Pick<
  ClientCrudService<
    FinancialEntity,
    FinancialEntity,
    FinancialEntityPayload,
    FinancialEntityPayload,
    FinancialEntityQueryParams
  >,
  'list'
>;

type FinancialEntitiesListPageViewModelParams = {
  service: FinancialEntitiesListService;
  routeBase: string;
  errorMessageFallback: string;
  showType?: boolean | undefined;
};

const initialFilterValues: FinancialEntityFilterValues = {
  query: '',
  code: '',
  status: '',
  type: '',
};

const isFinancialEntityStatus = (value: string): value is FinancialEntityStatus =>
  value === 'active' || value === 'inactive';

const isFinancialCategoryType = (value: string): value is FinancialCategoryType =>
  value === 'revenue' || value === 'expense';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): FinancialEntityStatus | undefined => {
  const stringValue = getStringValue(value);
  return isFinancialEntityStatus(stringValue) ? stringValue : undefined;
};

const getOptionalType = (value: unknown): FinancialCategoryType | undefined => {
  const stringValue = getStringValue(value);
  return isFinancialCategoryType(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: FinancialEntityFilterValues,
  includeType: boolean,
): Partial<FinancialEntityQueryParams> => ({
  search: getOptionalString(filterValues.query),
  code: getOptionalString(filterValues.code),
  status: getOptionalStatus(filterValues.status),
  type: includeType ? getOptionalType(filterValues.type) : undefined,
  page: 1,
});

export const useFinancialEntitiesListPageViewModel = ({
  service,
  routeBase,
  errorMessageFallback,
  showType = false,
}: FinancialEntitiesListPageViewModelParams) => {
  const navigate = useNavigate();
  const list = useFinancialEntitiesList(service, errorMessageFallback);
  const [filterValues, setFilterValues] =
    useState<FinancialEntityFilterValues>(initialFilterValues);

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    list.updateQuery(buildQueryFromFilters(filterValues, showType));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    list.updateQuery({
      page: 1,
      search: undefined,
      code: undefined,
      status: undefined,
      type: undefined,
    });
  };

  const buildRowActions = useCallback(
    (row: FinancialEntity): RowActionItem[] => [
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
    columns: buildFinancialEntitiesTableColumns({ buildRowActions, showType }),
    mobileConfig: buildFinancialEntitiesMobileConfig({ buildRowActions, showType }),
  };
};
