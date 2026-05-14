import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export type DataListColumnVisibility = {
  desktop?: boolean;
  tablet?: boolean;
  mobile?: boolean;
};

export type DataListColumnAlign = 'left' | 'center' | 'right';

export interface DataListColumn<RowData> {
  id: string;
  label: string;
  width?: string;
  minWidth?: string;
  align?: DataListColumnAlign;
  visibility?: DataListColumnVisibility;
  render: (row: RowData) => ReactNode;
  renderMobile?: (row: RowData) => ReactNode;
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
  renderSubtitle?: (row: RowData) => ReactNode;
  renderAvatar?: (row: RowData) => ReactNode;
  renderStatus?: (row: RowData) => ReactNode;
  renderActions?: (row: RowData) => ReactNode;
  renderDetails: (row: RowData) => ReactNode;
}

export interface DataListProps<RowData> {
  columns: DataListColumn<RowData>[];
  rows: RowData[];
  getRowKey: (row: RowData) => string;
  pagination?: DataListPaginationProps;
  mobileConfig?: DataListMobileConfig<RowData>;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  errorMessage?: string;
  onRetry?: () => void;
  sx?: SxProps<Theme>;
}
