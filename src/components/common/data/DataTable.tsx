import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { PaginationMeta } from '../../../models/pagination';
import { spacingScale } from '../../../theme/spacing';

export interface DataTableColumn<TData> {
  key: string;
  header: string;
  render: (item: TData) => ReactNode;
  mobileRender?: (item: TData) => string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<TData> {
  rows: TData[];
  columns: DataTableColumn<TData>[];
  meta: PaginationMeta;
  loading?: boolean;
  onPageChange: (nextPage: number) => void;
  onRowsPerPageChange: (nextLimit: number) => void;
}

export const DataTable = <TData,>({
  rows,
  columns,
  meta,
  onPageChange,
  onRowsPerPageChange,
}: DataTableProps<TData>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <>
        {rows.map((row, rowIndex) => (
          <Paper key={rowIndex} sx={{ p: spacingScale.sm, mb: spacingScale.xs }}>
            {columns.map((column) => (
              <Typography key={column.key} variant="body2" sx={{ mb: spacingScale.xxs }}>
                <strong>{column.header}:</strong>{' '}
                {column.mobileRender !== undefined ? column.mobileRender(row) : '-'}
              </Typography>
            ))}
          </Paper>
        ))}
        <TablePagination
          component="div"
          count={meta.total}
          page={Math.max(meta.page - 1, 0)}
          rowsPerPage={meta.limit}
          onPageChange={(_, page) => onPageChange(page + 1)}
          onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key} align={column.align ?? 'left'}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} hover>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align ?? 'left'}>
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
        page={Math.max(meta.page - 1, 0)}
        rowsPerPage={meta.limit}
        onPageChange={(_, page) => onPageChange(page + 1)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </TableContainer>
  );
};
