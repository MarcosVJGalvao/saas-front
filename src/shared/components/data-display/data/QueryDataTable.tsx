import type { ReactNode } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { PaginationMeta } from '@models/pagination';
import { spacingScale } from '@theme/spacing';
import { commonDataMessages } from '@shared/components/messages';
import { DataList } from '@shared/components/data-display/data/DataList';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import { FilterDrawer } from '@shared/components/data-display/data/FilterDrawer';
import { SearchBar } from '@shared/components/data-display/data/SearchBar';

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
  hideToolbar?: boolean;
  toolbarContent?: ReactNode;
  mobileConfig?: DataListMobileConfig<TData>;
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
  mobileConfig,
}: {
  loading: boolean;
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
  mobileConfig?: DataListMobileConfig<TData>;
}) => {
  const listRows: Array<{ key: string; value: TData }> = rows.map((row, index) => ({
    key: getRowId ? getRowId(row, index) : String(index),
    value: row,
  }));
  const mapMobileConfig = (
    config: DataListMobileConfig<TData>,
  ): DataListMobileConfig<{ key: string; value: TData }> => {
    const { renderSubtitle, renderAvatar, renderStatus, renderActions } = config;
    return {
      renderTitle: (row) => config.renderTitle(row.value),
      renderSubtitle: renderSubtitle ? (row) => renderSubtitle(row.value) : undefined,
      renderAvatar: renderAvatar ? (row) => renderAvatar(row.value) : undefined,
      renderStatus: renderStatus ? (row) => renderStatus(row.value) : undefined,
      renderActions: renderActions ? (row) => renderActions(row.value) : undefined,
      renderDetails: (row) => config.renderDetails(row.value),
    };
  };

  return (
    <DataList<{ key: string; value: TData }>
      rows={listRows}
      columns={columns.map((column) => ({
        id: column.key,
        label: column.header,
        align: column.align,
        width: column.width,
        minWidth: column.minWidth,
        visibility: column.visibility,
        render: (row) => column.render(row.value),
      }))}
      getRowKey={(row) => row.key}
      mobileConfig={mobileConfig ? mapMobileConfig(mobileConfig) : undefined}
      loading={loading}
      errorMessage={errorMessage}
      onRetry={onRetry}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      pagination={{
        page: Math.max(meta.page - 1, 0),
        rowsPerPage: meta.limit,
        rowsPerPageOptions: [10, 20, 50],
        totalItems: meta.total,
        onPageChange: (nextPage) => onPageChange(nextPage + 1),
        onRowsPerPageChange,
      }}
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
  hideToolbar = false,
  toolbarContent,
  mobileConfig,
}: QueryDataTableProps<TData>) => {
  const hasFilter = filterContent !== undefined;
  return (
    <Stack spacing={spacingScale.sm}>
      {toolbarContent}
      {!hideToolbar ? (
        <QueryDataTableToolbar
          query={query}
          onQueryChange={onQueryChange}
          queryDebounceInMilliseconds={queryDebounceInMilliseconds}
          showFilter={hasFilter}
          onOpenFilter={onOpenFilter}
        />
      ) : null}

      <QueryDataTableContent
        loading={loading}
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
        mobileConfig={mobileConfig}
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
