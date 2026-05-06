import type { SxProps, Theme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';

const SEARCH_DEBOUNCE_IN_MILLISECONDS = 400;

const resolveStatusFilterValue = (statusValue: string): 'active' | 'inactive' | undefined => {
  if (statusValue === 'active') return 'active';
  if (statusValue === 'inactive') return 'inactive';
  return undefined;
};

interface ClientsListFiltersParams {
  query: string;
  listQuery: {
    status?: 'active' | 'inactive';
    startDate?: string;
    endDate?: string;
  };
  onQueryChange: (value: string) => void;
  updateQuery: (patch: {
    search?: string;
    status?: 'active' | 'inactive';
    startDate?: string;
    endDate?: string;
    page: number;
  }) => void;
}

export const useClientsListFilters = ({
  query,
  listQuery,
  onQueryChange,
  updateQuery,
}: ClientsListFiltersParams) => {
  const [searchValue, setSearchValue] = useState(query);
  const latestAppliedSearchRef = useRef(query);
  const [pendingFilters, setPendingFilters] = useState({
    status: listQuery.status ?? '',
    startDate: listQuery.startDate ?? null,
    endDate: listQuery.endDate ?? null,
  });

  useEffect(() => {
    if (searchValue === latestAppliedSearchRef.current) return;

    const timeoutId = window.setTimeout(() => {
      onQueryChange(searchValue);
      latestAppliedSearchRef.current = searchValue;
    }, SEARCH_DEBOUNCE_IN_MILLISECONDS);

    return () => window.clearTimeout(timeoutId);
  }, [onQueryChange, searchValue]);

  const onFilterChange = (name: string, value: unknown) => {
    if (name === 'query') {
      setSearchValue(String(value));
      return;
    }
    if (name === 'status') {
      setPendingFilters((prev) => ({ ...prev, status: String(value) }));
      return;
    }
    if (name === 'startDate') {
      setPendingFilters((prev) => ({
        ...prev,
        startDate: typeof value === 'string' ? value : null,
      }));
      return;
    }
    if (name === 'endDate') {
      setPendingFilters((prev) => ({ ...prev, endDate: typeof value === 'string' ? value : null }));
    }
  };

  const applyFilters = () => {
    updateQuery({
      status: resolveStatusFilterValue(pendingFilters.status),
      startDate: pendingFilters.startDate ?? undefined,
      endDate: pendingFilters.endDate ?? undefined,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchValue('');
    latestAppliedSearchRef.current = '';
    setPendingFilters({ status: '', startDate: null, endDate: null });
    updateQuery({
      search: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1,
    });
  };

  const filterValues = {
    status: pendingFilters.status,
    query: searchValue,
    startDate: pendingFilters.startDate,
    endDate: pendingFilters.endDate,
  };

  const searchFieldSx: SxProps<Theme> = { gridColumn: { xs: 'auto', md: 'span 2', lg: 'span 2' } };

  return {
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    searchFieldSx,
  };
};
