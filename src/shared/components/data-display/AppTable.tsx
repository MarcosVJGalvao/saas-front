import Table from '@mui/material/Table';
import type { TableProps } from '@mui/material/Table';

export type AppTableProps = TableProps;

export const AppTable = (props: AppTableProps) => <Table {...props} />;
