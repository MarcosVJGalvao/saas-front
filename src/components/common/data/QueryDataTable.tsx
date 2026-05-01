import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TuneIcon from '@mui/icons-material/Tune';
import type { PaginationMeta } from '../../../models/pagination';
import { spacingScale } from '../../../theme/spacing';
import { CircularLoader } from '../loading/CircularLoader';
import { DataTable, type DataTableColumn } from './DataTable';
import { FilterDrawer } from './FilterDrawer';
import { SearchBar } from './SearchBar';
import { EmptyState } from '../state/EmptyState';
import { ErrorState } from '../state/ErrorState';

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
  emptyTitle = 'Nenhum registro encontrado',
  emptyDescription = 'Ajuste os filtros e tente novamente.',
}: QueryDataTableProps<TData>) => {
  const hasFilter = filterContent !== undefined;
  const hasError = errorMessage !== undefined && errorMessage.length > 0;

  return (
    <Stack spacing={spacingScale.sm}>
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
        {hasFilter ? (
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={onOpenFilter}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Filtros
          </Button>
        ) : null}
      </Stack>

      {loading ? <CircularLoader ariaLabel="Carregando dados" /> : null}
      {!loading && hasError ? <ErrorState message={errorMessage} onRetry={onRetry} /> : null}
      {!loading && !hasError && rows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : null}
      {!loading && !hasError && rows.length > 0 ? (
        <DataTable
          rows={rows}
          columns={columns}
          meta={meta}
          getRowId={getRowId}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      ) : null}

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
