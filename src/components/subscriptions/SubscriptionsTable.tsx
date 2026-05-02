import type { Subscription } from '../../models/subscriptions';
import type { DataTableColumn } from '../common/data/DataTable';
import { QueryDataTable } from '../common/data/QueryDataTable';
import {
  SubscriptionRowActions,
  SubscriptionStatusCell,
  SubscriptionTenantCell,
} from './SubscriptionRow';
import type { ReactNode } from 'react';

interface SubscriptionsTableProps {
  rows: Subscription[];
  loading: boolean;
  errorMessage?: string;
  page: number;
  limit: number;
  total: number;
  query: string;
  onQueryChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (id: string, tenantId: string) => void;
  onEdit: (id: string, tenantId: string) => void;
  onHistory: (id: string, tenantId: string) => void;
  onCancel: (id: string, tenantId: string) => void;
  onDelete: (id: string, tenantId: string) => void;
  toolbarContent?: ReactNode;
}

const formatCurrency = (value: string): string => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(normalized);
};

export const SubscriptionsTable = ({
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
  onHistory,
  onCancel,
  onDelete,
  toolbarContent,
}: SubscriptionsTableProps) => {
  const columns: DataTableColumn<Subscription>[] = [
    { key: 'tenant', header: 'Cliente', render: (row) => <SubscriptionTenantCell row={row} /> },
    { key: 'plan', header: 'Plano Atual', render: (row) => row.plan?.name ?? row.planId },
    { key: 'status', header: 'Status', render: (row) => <SubscriptionStatusCell row={row} /> },
    {
      key: 'startDate',
      header: 'Início',
      render: (row) => new Date(row.startDate).toLocaleDateString('pt-BR'),
    },
    {
      key: 'renewalDate',
      header: 'Renovação',
      render: (row) =>
        row.renewalDate ? new Date(row.renewalDate).toLocaleDateString('pt-BR') : '-',
    },
    {
      key: 'priceAtSubscription',
      header: 'Valor',
      render: (row) => formatCurrency(row.priceAtSubscription),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      render: (row) => (
        <SubscriptionRowActions
          row={row}
          onView={onView}
          onEdit={onEdit}
          onHistory={onHistory}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      ),
    },
  ];

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
      toolbarContent={toolbarContent}
      emptyTitle="Nenhuma assinatura encontrada"
      emptyDescription="Ajuste os filtros ou cadastre uma nova assinatura."
    />
  );
};
