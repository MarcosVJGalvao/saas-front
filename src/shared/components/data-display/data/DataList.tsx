import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme, type Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { ReactNode } from 'react';
import { spacingScale } from '@theme/spacing';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { sharedComponentsI18n } from '@shared/i18n/pt-BR/components';
import {
  DATA_LIST_DEFAULTS,
  DATA_LIST_DIMENSIONS,
} from '@shared/components/data-display/data/dataList.constants';
import type {
  DataListColumn,
  DataListColumnAlign,
  DataListPaginationProps,
  DataListProps,
} from '@shared/components/data-display/data/dataList.types';

type DataListViewport = 'desktop' | 'tablet' | 'mobile';

const getPaginationRangeLabel = ({
  page,
  rowsPerPage,
  totalItems,
}: {
  page: number;
  rowsPerPage: number;
  totalItems: number;
}) => {
  if (totalItems === 0) {
    return '0-0 de 0';
  }

  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, totalItems);

  return `${startItem}-${endItem} de ${totalItems}`;
};

const resolveViewport = (isMobile: boolean, isTablet: boolean): DataListViewport => {
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

const isColumnVisible = <RowData,>(column: DataListColumn<RowData>, viewport: DataListViewport) => {
  const visibility = column.visibility;
  if (visibility === undefined) return true;
  return visibility[viewport] ?? true;
};

const getCellJustify = (
  align: DataListColumnAlign | undefined,
): 'flex-start' | 'center' | 'flex-end' => {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  return 'flex-start';
};

const buildGridTemplateColumns = <RowData,>(columns: DataListColumn<RowData>[]): string => {
  return columns
    .map((column) => {
      if (column.width) return column.width;
      if (column.id === 'actions') return 'auto';
      if (column.minWidth) return `minmax(${column.minWidth}, 1fr)`;
      return 'minmax(0, 1fr)';
    })
    .join(' ');
};

const renderDesktopSkeleton = (gridTemplateColumns: string) => (
  <Stack>
    {Array.from({ length: DATA_LIST_DEFAULTS.rowSkeletonCount }).map((_, index) => (
      <Box
        key={`skeleton-row-${index}`}
        sx={{
          display: 'grid',
          gridTemplateColumns,
          gap: spacingScale.sm,
          px: spacingScale.md,
          py: DATA_LIST_DEFAULTS.rowPaddingY,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {gridTemplateColumns.split(' ').map((_, cellIndex) => (
          <Skeleton key={`skeleton-cell-${index}-${cellIndex}`} variant="text" height={24} />
        ))}
      </Box>
    ))}
  </Stack>
);

const renderMobileSkeleton = () => (
  <Stack spacing={spacingScale.sm} sx={{ p: spacingScale.sm }}>
    {Array.from({ length: DATA_LIST_DEFAULTS.mobileSkeletonCount }).map((_, index) => (
      <Skeleton key={`mobile-skeleton-${index}`} variant="rounded" height={136} />
    ))}
  </Stack>
);

const renderMobileHeader = (title: string, actionsLabel: string) => (
  <Stack
    direction="row"
    sx={{
      justifyContent: 'space-between',
      alignItems: 'center',
      px: spacingScale.xs,
      pb: spacingScale.xs,
      borderBottom: (themeObj) => `1px solid ${themeObj.palette.divider}`,
    }}
  >
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
      {actionsLabel}
    </Typography>
  </Stack>
);

const getMobileHeaderLabels = <RowData,>(visibleColumns: DataListColumn<RowData>[]) => ({
  title: visibleColumns[0]?.label ?? sharedComponentsI18n.dataList.mobileItemsFallback,
  actions:
    visibleColumns.find((column) => column.id === 'actions')?.label ??
    sharedComponentsI18n.dataList.mobileActionsFallback,
});

const renderFallbackMobileCards = <RowData,>(
  rows: RowData[],
  getRowKey: (row: RowData) => string,
  visibleColumns: DataListColumn<RowData>[],
) => {
  const header = getMobileHeaderLabels(visibleColumns);
  const mainColumn = visibleColumns.find((column) => column.id !== 'actions') ?? null;
  const actionsColumn = visibleColumns.find((column) => column.id === 'actions') ?? null;
  const detailColumns = visibleColumns.filter(
    (column) => column.id !== 'actions' && column.id !== mainColumn?.id,
  );

  return (
    <Stack spacing={spacingScale.sm} sx={{ p: spacingScale.sm }}>
      {renderMobileHeader(header.title, header.actions)}
      {rows.map((row) => (
        <Paper
          key={getRowKey(row)}
          variant="outlined"
          sx={{ p: spacingScale.sm, borderRadius: DATA_LIST_DIMENSIONS.mobileCardRadius }}
        >
          <Stack spacing={spacingScale.xs}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ minWidth: 0 }}>{mainColumn ? mainColumn.render(row) : null}</Box>
              {actionsColumn ? actionsColumn.render(row) : null}
            </Stack>
            {detailColumns.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: spacingScale.xs,
                }}
              >
                {detailColumns.map((column) => (
                  <Stack key={`${getRowKey(row)}-mobile-${column.id}`} spacing={spacingScale.xxs}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {column.label}
                    </Typography>
                    <Box>{column.render(row)}</Box>
                  </Stack>
                ))}
              </Box>
            ) : null}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

const renderConfiguredMobileCards = <RowData,>(
  rows: RowData[],
  getRowKey: (row: RowData) => string,
  visibleColumns: DataListColumn<RowData>[],
  mobileConfig: NonNullable<DataListProps<RowData>['mobileConfig']>,
) => {
  const header = getMobileHeaderLabels(visibleColumns);
  return (
    <Stack spacing={spacingScale.sm} sx={{ p: spacingScale.sm }}>
      {renderMobileHeader(header.title, header.actions)}
      {rows.map((row) => (
        <Paper
          key={getRowKey(row)}
          variant="outlined"
          sx={{ p: spacingScale.sm, borderRadius: DATA_LIST_DIMENSIONS.mobileCardRadius }}
        >
          <Stack spacing={spacingScale.xs}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <Stack direction="row" spacing={spacingScale.xs} sx={{ alignItems: 'center' }}>
                {mobileConfig.renderAvatar ? mobileConfig.renderAvatar(row) : null}
                <Stack spacing={spacingScale.xxs}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {mobileConfig.renderTitle(row)}
                  </Typography>
                  {mobileConfig.renderSubtitle ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {mobileConfig.renderSubtitle(row)}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
              {mobileConfig.renderActions ? mobileConfig.renderActions(row) : null}
            </Stack>
            {mobileConfig.renderStatus ? mobileConfig.renderStatus(row) : null}
            {mobileConfig.renderDetails(row)}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

const DataListPagination = ({
  pagination,
  isMobile,
}: {
  pagination: DataListPaginationProps;
  isMobile: boolean;
}) => {
  const pageCount = Math.max(Math.ceil(pagination.totalItems / pagination.rowsPerPage), 1);
  const isPreviousDisabled = pagination.page <= 0;
  const isNextDisabled = pagination.page >= pageCount - 1;

  return (
    <Box
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        minHeight: DATA_LIST_DIMENSIONS.footerMinHeight,
        px: spacingScale.md,
        py: spacingScale.sm,
      }}
    >
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={spacingScale.sm}
        sx={{ alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'flex-end' }}
      >
        <Stack direction="row" spacing={spacingScale.xs} sx={{ alignItems: 'center' }}>
          <Typography variant="body2">
            {sharedComponentsI18n.dataList.pagination.rowsPerPage}
          </Typography>
          <Select
            size="small"
            value={pagination.rowsPerPage}
            onChange={(event) => pagination.onRowsPerPageChange(Number(event.target.value))}
            variant="standard"
            disableUnderline
            sx={{
              minWidth: 40,
              '& .MuiSelect-select': { py: 0.25, pr: 2.5 },
            }}
          >
            {pagination.rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Typography variant="body2">{getPaginationRangeLabel(pagination)}</Typography>
        <Stack direction="row" spacing={spacingScale.xxs}>
          <IconButton
            aria-label={sharedComponentsI18n.dataList.pagination.previous}
            onClick={() => pagination.onPageChange(Math.max(pagination.page - 1, 0))}
            disabled={isPreviousDisabled}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={sharedComponentsI18n.dataList.pagination.next}
            onClick={() => pagination.onPageChange(Math.min(pagination.page + 1, pageCount - 1))}
            disabled={isNextDisabled}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export const DataList = <RowData,>({
  columns,
  rows,
  getRowKey,
  pagination,
  mobileConfig,
  loading = false,
  emptyTitle = sharedComponentsI18n.dataList.emptyTitle,
  emptyDescription = sharedComponentsI18n.dataList.emptyDescription,
  errorMessage,
  onRetry,
  sx,
}: DataListProps<RowData>) => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const viewport = resolveViewport(isMobile, isTablet);
  const visibleColumns = columns.filter((column) => isColumnVisible(column, viewport));
  const gridTemplateColumns = buildGridTemplateColumns(visibleColumns);

  const renderTableRow = (row: RowData | null, isHeader: boolean) => (
    <Box
      key={isHeader ? 'header-row' : row ? getRowKey(row) : 'row'}
      sx={{
        display: 'grid',
        gridTemplateColumns,
        gap: spacingScale.sm,
        px: spacingScale.md,
        py: isHeader ? spacingScale.sm : DATA_LIST_DEFAULTS.rowPaddingY,
        minHeight: isHeader ? 'auto' : DATA_LIST_DIMENSIONS.rowMinHeight,
        borderBottom: (themeObj) => `1px solid ${themeObj.palette.divider}`,
        alignItems: 'center',
        '&:hover': isHeader
          ? undefined
          : { backgroundColor: (themeObj) => themeObj.palette.action.hover },
      }}
    >
      {visibleColumns.map((column) => (
        <Box
          key={`${isHeader ? 'header' : row ? getRowKey(row) : 'row'}-${column.id}`}
          sx={{ display: 'flex', justifyContent: getCellJustify(column.align) }}
        >
          {isHeader ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {column.label}
            </Typography>
          ) : row ? (
            column.render(row)
          ) : null}
        </Box>
      ))}
    </Box>
  );

  const renderStateContent = (): ReactNode => {
    if (loading) {
      return viewport === 'mobile'
        ? renderMobileSkeleton()
        : renderDesktopSkeleton(gridTemplateColumns);
    }

    if (errorMessage && errorMessage.length > 0) {
      return <AppErrorState message={errorMessage} onRetry={onRetry} />;
    }

    if (rows.length === 0) {
      return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    if (viewport === 'mobile' && mobileConfig) {
      return renderConfiguredMobileCards(rows, getRowKey, visibleColumns, mobileConfig);
    }

    if (viewport === 'mobile') {
      return renderFallbackMobileCards(rows, getRowKey, visibleColumns);
    }

    return (
      <>
        {renderTableRow(null, true)}
        {rows.map((row) => renderTableRow(row, false))}
      </>
    );
  };

  return (
    <Paper
      sx={{
        backgroundColor: 'background.paper',
        border: (themeObj) => `1px solid ${themeObj.palette.divider}`,
        borderRadius: DATA_LIST_DIMENSIONS.borderRadius,
        overflow: 'hidden',
        ...sx,
      }}
      aria-busy={loading}
    >
      <Box sx={{ overflowX: 'auto' }}>{renderStateContent()}</Box>
      {pagination ? (
        <DataListPagination pagination={pagination} isMobile={viewport === 'mobile'} />
      ) : null}
    </Paper>
  );
};
