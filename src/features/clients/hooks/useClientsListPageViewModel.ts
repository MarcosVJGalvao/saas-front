import { useCallback } from 'react';
import {
  buildClientsExportActionIcon,
  buildClientsMobileConfig,
  buildClientsPageHeader,
  buildClientsSummaryCards,
  buildClientsTableColumns,
} from '@features/clients/components/clientsListPresentation';
import type { Client } from '@features/clients/types/clients';
import { useClientsListFilters } from '@features/clients/hooks/useClientsListFilters';
import { useClientsListPage } from '@features/clients/hooks/useClientsListPage';

export const useClientsListPageViewModel = () => {
  const view = useClientsListPage();
  const buildClientActions = useCallback(
    (row: Client) => [
      {
        key: 'view',
        label: 'Ver detalhes',
        onClick: () => view.setSelectedClientId(row.id),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void view.navigate(`/platform/clients/${row.id}/edit`),
      },
      { key: 'delete', label: 'Excluir', onClick: () => view.setDeleteClientId(row.id) },
    ],
    [view],
  );
  const rows = view.list.rows;
  const total = view.list.meta.total;
  const activeCount = rows.filter((item) => item.status === 'active').length;
  const inactiveCount = rows.filter((item) => item.status === 'inactive').length;
  const trialCount = Math.max(0, total - activeCount - inactiveCount);
  const query = view.list.query.search ?? '';
  const onQueryChange = (search: string) => view.list.updateQuery({ search, page: 1 });
  const filters = useClientsListFilters({
    query,
    listQuery: view.list.query,
    onQueryChange,
    updateQuery: view.list.updateQuery,
  });

  return {
    view,
    pageHeader: buildClientsPageHeader({
      canShowAction: view.can('platform:clients:create'),
      onAction: () => void view.navigate('/platform/clients/onboarding'),
    }),
    cards: buildClientsSummaryCards({ total, activeCount, trialCount, inactiveCount }),
    exportActionIcon: buildClientsExportActionIcon(),
    filters,
    query,
    onQueryChange,
    onPageChange: (page: number) => view.list.updateQuery({ page }),
    onLimitChange: (limit: number) => view.list.updateQuery({ limit, page: 1 }),
    onEdit: (id: string) => void view.navigate(`/platform/clients/${id}/edit`),
    columns: buildClientsTableColumns({ buildClientActions }),
    mobileConfig: buildClientsMobileConfig({ buildClientActions }),
  };
};
