import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export type DataListColumnVisibility = {
  desktop?: boolean | undefined;
  tablet?: boolean | undefined;
  mobile?: boolean | undefined;
};

export type DataListColumnAlign = 'left' | 'center' | 'right';

export interface DataListColumn<RowData> {
  id: string;
  label: string;
  width?: string | undefined;
  minWidth?: string | undefined;
  align?: DataListColumnAlign | undefined;
  visibility?: DataListColumnVisibility | undefined;
  render: (row: RowData) => ReactNode;
  renderMobile?: ((row: RowData) => ReactNode) | undefined;
}

export interface DataListPaginationProps {
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  totalItems: number;
  onPageChange: (nextPage: number) => void;
  onRowsPerPageChange: (nextRowsPerPage: number) => void;
}

export interface DataListMobileConfig<RowData> {
  renderTitle: (row: RowData) => ReactNode;
  renderSubtitle?: ((row: RowData) => ReactNode) | undefined;
  renderAvatar?: ((row: RowData) => ReactNode) | undefined;
  renderStatus?: ((row: RowData) => ReactNode) | undefined;
  renderActions?: ((row: RowData) => ReactNode) | undefined;
  renderDetails: (row: RowData) => ReactNode;
}

export interface DataListProps<RowData> {
  columns: DataListColumn<RowData>[];
  rows: RowData[];
  getRowKey: (row: RowData) => string;
  pagination?: DataListPaginationProps | undefined;
  mobileConfig?: DataListMobileConfig<RowData> | undefined;
  loading?: boolean | undefined;
  emptyTitle?: string | undefined;
  emptyDescription?: string | undefined;
  errorMessage?: string | undefined;
  onRetry?: (() => void) | undefined;
  sx?: SxProps<Theme> | undefined;
}
