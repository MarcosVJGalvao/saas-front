import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  buildFinancialTransactionColumns,
  buildFinancialTransactionMobileConfig,
} from '@features/client/financial/components/financialTransactionListColumns';
import { useFinancialTransactionsList } from '@features/client/financial/hooks/useFinancialTransactionsList';
import type { FinancialTransactionQueryParams } from '@features/client/financial/types/financial.types';

type FinancialTransactionFilterValues = {
  query: string;
  type: string;
  originType: string;
  status: string;
  startDate: string;
  endDate: string;
};

const initialFilterValues: FinancialTransactionFilterValues = {
  query: '',
  type: '',
  originType: '',
  status: '',
  startDate: '',
  endDate: '',
};

const getOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

const isFinancialTransactionType = (
  value: string,
): value is NonNullable<FinancialTransactionQueryParams['type']> =>
  value === 'income' ||
  value === 'expense' ||
  value === 'reversal_income' ||
  value === 'reversal_expense';

const isFinancialOriginType = (
  value: string,
): value is NonNullable<FinancialTransactionQueryParams['originType']> =>
  value === 'accounts_payable' ||
  value === 'accounts_receivable' ||
  value === 'manual' ||
  value === 'reversal';

const isFinancialRecordStatus = (
  value: string,
): value is NonNullable<FinancialTransactionQueryParams['status']> =>
  value === 'open' ||
  value === 'partially_paid' ||
  value === 'paid' ||
  value === 'received' ||
  value === 'overdue' ||
  value === 'cancelled' ||
  value === 'reversed';

const buildQuery = (
  filterValues: FinancialTransactionFilterValues,
): Partial<FinancialTransactionQueryParams> => ({
  search: getOptionalText(filterValues.query),
  type: isFinancialTransactionType(filterValues.type) ? filterValues.type : undefined,
  originType: isFinancialOriginType(filterValues.originType) ? filterValues.originType : undefined,
  status: isFinancialRecordStatus(filterValues.status) ? filterValues.status : undefined,
  startDate: getOptionalText(filterValues.startDate),
  endDate: getOptionalText(filterValues.endDate),
  page: 1,
});

export const useFinancialTransactionsPage = () => {
  const navigate = useNavigate();
  const financialTransactionsList = useFinancialTransactionsList();
  const [filterValues, setFilterValues] =
    useState<FinancialTransactionFilterValues>(initialFilterValues);

  return {
    financialTransactionsList,
    filterValues,
    onFilterChange: (fieldName: string, fieldValue: unknown) => {
      setFilterValues((currentValues) => ({
        ...currentValues,
        [fieldName]: typeof fieldValue === 'string' ? fieldValue : '',
      }));
    },
    applyFilters: () => {
      financialTransactionsList.updateQuery(buildQuery(filterValues));
    },
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      financialTransactionsList.updateQuery({
        search: undefined,
        type: undefined,
        originType: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      });
    },
    tableColumns: buildFinancialTransactionColumns({
      onDetails: (transaction) => {
        void navigate(`/client/financial/transactions/${transaction.id}`);
      },
    }),
    mobileConfig: buildFinancialTransactionMobileConfig({
      onDetails: (transaction) => {
        void navigate(`/client/financial/transactions/${transaction.id}`);
      },
    }),
  };
};
