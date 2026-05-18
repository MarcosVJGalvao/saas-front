import { useState } from 'react';
import {
  financialTransactionsColumns,
  financialTransactionsMobileConfig,
} from '@features/client/financial/components/financialTransactionsPresentation';
import { useFinancialTransactionsList } from '@features/client/financial/hooks/useFinancialTransactionsList';
import type {
  FinancialOriginType,
  FinancialRecordStatus,
  FinancialTransactionQueryParams,
  FinancialTransactionType,
} from '@features/client/financial/types/financial.types';

type FinancialTransactionFilterValues = Record<string, unknown>;

const initialFilterValues: FinancialTransactionFilterValues = {
  query: '',
  type: '',
  originType: '',
  status: '',
  startDate: '',
  endDate: '',
};

const isFinancialTransactionType = (value: string): value is FinancialTransactionType =>
  value === 'income' ||
  value === 'expense' ||
  value === 'reversal_income' ||
  value === 'reversal_expense';

const isFinancialOriginType = (value: string): value is FinancialOriginType =>
  value === 'accounts_payable' ||
  value === 'accounts_receivable' ||
  value === 'manual' ||
  value === 'reversal';

const isFinancialRecordStatus = (value: string): value is FinancialRecordStatus =>
  value === 'open' ||
  value === 'partially_paid' ||
  value === 'paid' ||
  value === 'received' ||
  value === 'overdue' ||
  value === 'cancelled' ||
  value === 'reversed';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalTransactionType = (value: unknown): FinancialTransactionType | undefined => {
  const stringValue = getStringValue(value);
  return isFinancialTransactionType(stringValue) ? stringValue : undefined;
};

const getOptionalOriginType = (value: unknown): FinancialOriginType | undefined => {
  const stringValue = getStringValue(value);
  return isFinancialOriginType(stringValue) ? stringValue : undefined;
};

const getOptionalRecordStatus = (value: unknown): FinancialRecordStatus | undefined => {
  const stringValue = getStringValue(value);
  return isFinancialRecordStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: FinancialTransactionFilterValues,
): Partial<FinancialTransactionQueryParams> => ({
  search: getOptionalString(filterValues.query),
  type: getOptionalTransactionType(filterValues.type),
  originType: getOptionalOriginType(filterValues.originType),
  status: getOptionalRecordStatus(filterValues.status),
  startDate: getOptionalString(filterValues.startDate),
  endDate: getOptionalString(filterValues.endDate),
  page: 1,
});

export const useFinancialTransactionsPageViewModel = () => {
  const list = useFinancialTransactionsList();
  const [filterValues, setFilterValues] =
    useState<FinancialTransactionFilterValues>(initialFilterValues);

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
      type: undefined,
      originType: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

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
    columns: financialTransactionsColumns,
    mobileConfig: financialTransactionsMobileConfig,
  };
};
