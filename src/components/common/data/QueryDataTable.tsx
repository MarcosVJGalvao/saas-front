import type { ReactNode } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { PaginationMeta } from '../../../models/pagination';
import { spacingScale } from '../../../theme/spacing';
import { CircularLoader } from '../loading/CircularLoader';
import { commonDataMessages } from '../messages';
import { EmptyState } from '../state/EmptyState';
import { ErrorState } from '../state/ErrorState';
import { DataTable, type DataTableColumn } from './DataTable';
import { FilterDrawer } from './FilterDrawer';
import { SearchBar } from './SearchBar';

const defaultErrorMessage = 'Erro ao carregar dados.';

interface QueryDataTableProps<TData> {
  rows: TData[];
  columns: DataTableColumn<TData>[];
  meta: PaginationMeta;
  getRowId?: (row: TData, index: number) => string;
  query: string;
  onQueryChange: (nextValue: string) => void;
  queryDebounceInMilliseconds?: number;
  loading: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onPageChange: (nextPage: number) => void;
  onRowsPerPageChange: (nextLimit: number) => void;
  filterContent?: ReactNode;
  filterOpen?: boolean;
  onOpenFilter?: () => void;
  onCloseFilter?: () => void;
  onApplyFilter?: () => void;
  onClearFilter?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

const QueryDataTableToolbar = ({
  query,
  onQueryChange,
  queryDebounceInMilliseconds,
  showFilter,
  onOpenFilter,
}: {
  query: string;
  onQueryChange: (nextValue: string) => void;
  queryDebounceInMilliseconds: number;
  showFilter: boolean;
  onOpenFilter?: () => void;
}) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={spacingScale.xs}
    sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
  >
    <SearchBar
      value={query}
      onChange={onQueryChange}
      debounceInMilliseconds={queryDebounceInMilliseconds}
    />
    {showFilter ? (
      <Button
        variant="outlined"
        startIcon={<TuneIcon />}
        onClick={onOpenFilter}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        {commonDataMessages.filterButton}
      </Button>
    ) : null}
  </Stack>
);

const QueryDataTableContent = <TData,>({
  loading,
  hasError,
  errorMessage,
  onRetry,
  rows,
  columns,
  meta,
  getRowId,
  onPageChange,
  onRowsPerPageChange,
  emptyTitle,
  emptyDescription,
}: {
  loading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  rows: TData[];
  columns: DataTableColumn<TData>[];
  meta: PaginationMeta;
  getRowId?: (row: TData, index: number) => string;
  onPageChange: (nextPage: number) => void;
  onRowsPerPageChange: (nextLimit: number) => void;
  emptyTitle: string;
  emptyDescription: string;
}) => {
  if (loading) {
    return <CircularLoader ariaLabel={commonDataMessages.loadingData} />;
  }

  if (hasError) {
    return <ErrorState message={errorMessage ?? defaultErrorMessage} onRetry={onRetry} />;
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <DataTable
      rows={rows}
      columns={columns}
      meta={meta}
      getRowId={getRowId}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

export const QueryDataTable = <TData,>({
  rows,
  columns,
  meta,
  getRowId,
  query,
  onQueryChange,
  queryDebounceInMilliseconds = 300,
  loading,
  errorMessage,
  onRetry,
  onPageChange,
  onRowsPerPageChange,
  filterContent,
  filterOpen = false,
  onOpenFilter,
  onCloseFilter,
  onApplyFilter,
  onClearFilter,
  emptyTitle = commonDataMessages.emptyTitle,
  emptyDescription = commonDataMessages.emptyDescription,
}: QueryDataTableProps<TData>) => {
  const hasFilter = filterContent !== undefined;
  const hasError = errorMessage !== undefined && errorMessage.length > 0;

  return (
    <Stack spacing={spacingScale.sm}>
      <QueryDataTableToolbar
        query={query}
        onQueryChange={onQueryChange}
        queryDebounceInMilliseconds={queryDebounceInMilliseconds}
        showFilter={hasFilter}
        onOpenFilter={onOpenFilter}
      />

      <QueryDataTableContent
        loading={loading}
        hasError={hasError}
        errorMessage={errorMessage}
        onRetry={onRetry}
        rows={rows}
        columns={columns}
        meta={meta}
        getRowId={getRowId}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />

      {hasFilter && onCloseFilter && onApplyFilter && onClearFilter ? (
        <FilterDrawer
          open={filterOpen}
          onClose={onCloseFilter}
          onApply={onApplyFilter}
          onClear={onClearFilter}
        >
          {filterContent}
        </FilterDrawer>
      ) : null}
    </Stack>
  );
};
