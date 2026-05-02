import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMemo, useState } from 'react';
import type { Plan } from '../../models/plans';
import type { DataTableColumn } from '../common/data/DataTable';
import { QueryDataTable } from '../common/data/QueryDataTable';

interface PlansTableProps {
  rows: Plan[];
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

const translateBillingCycle = (value: Plan['billingCycle']): string =>
  value === 'monthly' ? 'Mensal' : 'Anual';

const formatCurrency = (value: string, currency: string): string => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return `${value} ${currency}`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(normalized);
};

const PlanActions = ({
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

export const PlansTable = ({
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
}: PlansTableProps) => {
  const columns = useMemo<DataTableColumn<Plan>[]>(
    () => [
      { key: 'name', header: 'Nome', render: (row) => row.name },
      { key: 'description', header: 'Descrição', render: (row) => row.description ?? '-' },
      { key: 'price', header: 'Preço', render: (row) => formatCurrency(row.price, row.currency) },
      {
        key: 'billingCycle',
        header: 'Ciclo',
        render: (row) => translateBillingCycle(row.billingCycle),
      },
      { key: 'trialDays', header: 'Trial', render: (row) => `${row.trialDays} dias` },
      {
        key: 'isActive',
        header: 'Status',
        render: (row) => (
          <Chip
            size="small"
            label={row.isActive ? 'Ativo' : 'Inativo'}
            color={row.isActive ? 'success' : 'default'}
          />
        ),
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
          <PlanActions id={row.id} onView={onView} onEdit={onEdit} onDelete={onDelete} />
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
        totalPages: Math.max(1, Math.ceil(total / Math.max(limit, 1))),
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
      emptyTitle="Nenhum plano encontrado"
      emptyDescription="Ajuste os filtros ou cadastre um novo plano."
    />
  );
};
