import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import {
  buildFinancialEntityColumns,
  buildFinancialEntityMobileConfig,
} from '@features/client/financial/components/financialEntityListColumns';
import { useFinancialEntitiesList } from '@features/client/financial/hooks/useFinancialEntitiesList';
import type {
  FinancialEntity,
  FinancialEntityQueryParams,
} from '@features/client/financial/types/financial.types';

type FinancialEntityListService = {
  list: (params: FinancialEntityQueryParams) => Promise<{
    data: FinancialEntity[];
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

type UseFinancialEntityListBaseParams = {
  routeBase: string;
  service: FinancialEntityListService;
  errorMessageFallback: string;
  showType: boolean;
};

type FinancialEntityFilterValues = {
  query: string;
  code: string;
  status: string;
  type: string;
};

const initialFilterValues: FinancialEntityFilterValues = {
  query: '',
  code: '',
  status: '',
  type: '',
};

const getOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

const isFinancialEntityStatus = (value: string): value is 'active' | 'inactive' =>
  value === 'active' || value === 'inactive';

const isFinancialCategoryType = (value: string): value is 'revenue' | 'expense' =>
  value === 'revenue' || value === 'expense';

export const useFinancialEntityListBase = ({
  routeBase,
  service,
  errorMessageFallback,
  showType,
}: UseFinancialEntityListBaseParams): {
  financialEntityList: ReturnType<typeof useFinancialEntitiesList>;
  filterValues: FinancialEntityFilterValues;
  onFilterChange: (fieldName: string, fieldValue: unknown) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  tableColumns: DataTableColumn<FinancialEntity>[];
  mobileConfig: DataListMobileConfig<FinancialEntity>;
} => {
  const navigate = useNavigate();
  const financialEntityList = useFinancialEntitiesList(service, errorMessageFallback);
  const [filterValues, setFilterValues] =
    useState<FinancialEntityFilterValues>(initialFilterValues);

  const onFilterChange = (fieldName: string, fieldValue: unknown): void => {
    setFilterValues((currentValues) => ({
      ...currentValues,
      [fieldName]: typeof fieldValue === 'string' ? fieldValue : '',
    }));
  };

  const applyFilters = (): void => {
    financialEntityList.updateQuery({
      search: getOptionalText(filterValues.query),
      code: getOptionalText(filterValues.code),
      status: isFinancialEntityStatus(filterValues.status) ? filterValues.status : undefined,
      type: showType && isFinancialCategoryType(filterValues.type) ? filterValues.type : undefined,
      page: 1,
    });
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    financialEntityList.updateQuery({
      search: undefined,
      code: undefined,
      status: undefined,
      type: undefined,
      page: 1,
    });
  };

  const actions = {
    onDetails: (entity: FinancialEntity) => {
      void navigate(`${routeBase}/${entity.id}`);
    },
    onEdit: (entity: FinancialEntity) => {
      void navigate(`${routeBase}/${entity.id}/edit`, { state: { entity } });
    },
  };

  return {
    financialEntityList,
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    tableColumns: buildFinancialEntityColumns(actions, showType),
    mobileConfig: buildFinancialEntityMobileConfig(actions, showType),
  };
};
