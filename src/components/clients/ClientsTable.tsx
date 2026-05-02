import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import type { Client } from '../../models/clients';
import type { DataTableColumn } from '../common/data/DataTable';
import { QueryDataTable } from '../common/data/QueryDataTable';
import { ClientStatusBadge } from './ClientStatusBadge';

interface ClientsTableProps {
  rows: Client[];
  loading: boolean;
  errorMessage?: string;
  page: number;
  limit: number;
  total: number;
  query: string;
  onQueryChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ClientActions = ({
  id,
  onView,
  onEdit,
  onDelete,
}: {
  id: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <IconButton size="small" onClick={(event) => setAnchor(event.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onView(id);
          }}
        >
          Ver detalhes
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onEdit(id);
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onDelete(id);
          }}
        >
          Excluir
        </MenuItem>
      </Menu>
    </>
  );
};

export const ClientsTable = ({
  rows,
  loading,
  errorMessage,
  page,
  limit,
  total,
  query,
  onQueryChange,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
}: ClientsTableProps) => {
  const columns = useMemo<DataTableColumn<Client>[]>(
    () => [
      {
        key: 'client',
        header: 'Cliente',
        render: (row) => (
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
              {row.tradeName?.charAt(0) ?? row.legalName.charAt(0)}
            </Avatar>
            <Stack>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {row.legalName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      { key: 'document', header: 'Documento', render: (row) => row.documentNumber },
      { key: 'tenant', header: 'Tenant', render: (row) => row.tenantSlug ?? '-' },
      { key: 'plan', header: 'Plano', render: (row) => row.planName ?? '-' },
      {
        key: 'status',
        header: 'Status',
        render: (row) => <ClientStatusBadge status={row.status} />,
      },
      {
        key: 'createdAt',
        header: 'Criado em',
        render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
      },
      {
        key: 'actions',
        header: 'Ações',
        align: 'right',
        render: (row) => (
          <ClientActions id={row.id} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ),
      },
    ],
    [onDelete, onEdit, onView],
  );

  return (
    <QueryDataTable
      rows={rows}
      columns={columns}
      meta={{
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      }}
      query={query}
      onQueryChange={onQueryChange}
      loading={loading}
      errorMessage={errorMessage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onLimitChange}
      hideToolbar
    />
  );
};
