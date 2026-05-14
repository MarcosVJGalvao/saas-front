import { useCallback, useMemo, type ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { PaginationMeta } from '@models/pagination';
import { spacingScale } from '@theme/spacing';
import type { DataListColumnVisibility } from '@shared/components/data-display/data/dataList.types';

export interface DataTableColumn<TData> {
  key: string;
  header: string;
  render: (item: TData) => ReactNode;
  mobileRender?: (item: TData) => string;
  align?: 'left' | 'right' | 'center';
  width?: string;
  minWidth?: string;
  visibility?: DataListColumnVisibility;
}

interface DataTableProps<TData> {
  rows: TData[];
  columns: DataTableColumn<TData>[];
  meta: PaginationMeta;
  getRowId?: (row: TData, index: number) => string;
  onPageChange: (nextPage: number) => void;
  onRowsPerPageChange: (nextLimit: number) => void;
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];
const EMPTY_MOBILE_VALUE = '-';
const TABLE_ROWS_PER_PAGE_LABEL = 'Itens por página:';
const TABLE_DISPLAYED_ROWS_LABEL = ({
  from,
  to,
  count,
}: {
  from: number;
  to: number;
  count: number;
}) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`;

export const DataTable = <TData,>({
  rows,
  columns,
  meta,
  getRowId,
  onPageChange,
  onRowsPerPageChange,
}: DataTableProps<TData>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentPage = useMemo(() => Math.max(meta.page - 1, 0), [meta.page]);
  const resolveRowId = useCallback(
    (row: TData, rowIndex: number) => (getRowId ? getRowId(row, rowIndex) : String(rowIndex)),
    [getRowId],
  );

  if (isMobile) {
    return (
      <>
        {rows.map((row, rowIndex) => (
          <Paper key={resolveRowId(row, rowIndex)} sx={{ p: spacingScale.sm, mb: spacingScale.xs }}>
            {columns.map((column) => (
              <Typography key={column.key} variant="body2" sx={{ mb: spacingScale.xxs }}>
                <strong>{column.header}:</strong>{' '}
                {column.mobileRender !== undefined ? column.mobileRender(row) : EMPTY_MOBILE_VALUE}
              </Typography>
            ))}
          </Paper>
        ))}
        <TablePagination
          component="div"
          count={meta.total}
          page={currentPage}
          rowsPerPage={meta.limit}
          labelRowsPerPage={TABLE_ROWS_PER_PAGE_LABEL}
          labelDisplayedRows={TABLE_DISPLAYED_ROWS_LABEL}
          onPageChange={(_, page) => onPageChange(page + 1)}
          onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      </>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: theme.spacing(1.5) }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align ?? 'left'}
                sx={{
                  fontSize: theme.typography.body2.fontSize,
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  py: theme.spacing(2.25),
                }}
              >
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={resolveRowId(row, rowIndex)}
              hover
              sx={{
                '& td': { height: 48 },
                '&:hover': { bgcolor: theme.palette.background.default },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align ?? 'left'}
                  sx={{ fontSize: theme.typography.body2.fontSize, py: theme.spacing(1.5) }}
                >
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={meta.total}
        page={currentPage}
        rowsPerPage={meta.limit}
        labelRowsPerPage={TABLE_ROWS_PER_PAGE_LABEL}
        labelDisplayedRows={TABLE_DISPLAYED_ROWS_LABEL}
        onPageChange={(_, page) => onPageChange(page + 1)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        sx={{ '.MuiTablePagination-toolbar': { justifyContent: 'flex-end' } }}
      />
    </TableContainer>
  );
};
