import {
  buildSubscriptionMetrics,
  buildSubscriptionsListColumns,
  buildSubscriptionsMobileConfig,
  parseSubscriptionStatus,
  subscriptionStatusOptions,
} from '@features/platform/subscriptions/components/subscriptionsListPresentation';
import type {
  Subscription,
  SubscriptionsQueryParams,
} from '@features/platform/subscriptions/types/subscriptions';
import { useSubscriptionsListPage } from '@features/platform/subscriptions/hooks/useSubscriptionsListPage';

const buildPeriodLabel = (query: SubscriptionsQueryParams): string => {
  if (!query.startDate || !query.endDate) return '';
  const start = new Date(query.startDate).toLocaleDateString('pt-BR');
  const end = new Date(query.endDate).toLocaleDateString('pt-BR');
  return `${start} - ${end}`;
};

const buildClearFiltersPatch = (): Partial<SubscriptionsQueryParams> => ({
  search: '',
  status: undefined,
  planId: undefined,
  startDate: undefined,
  endDate: undefined,
  page: 1,
});

export const useSubscriptionsListViewModel = () => {
  const view = useSubscriptionsListPage();
  const buildRowActions = (row: Subscription) => [
    {
      key: 'view',
      label: 'Ver detalhes',
      onClick: () =>
        void view.navigate(`/platform/subscriptions/${row.id}?tenantId=${row.tenantId}`),
    },
    {
      key: 'edit',
      label: 'Editar',
      onClick: () =>
        void view.navigate(`/platform/subscriptions/${row.id}/edit?tenantId=${row.tenantId}`),
    },
    {
      key: 'history',
      label: 'Histórico',
      onClick: () => {
        view.setSelected({ id: row.id, tenantId: row.tenantId });
        void view.mutations
          .history(row.id, row.tenantId)
          .then((historyRows) => view.setHistoryRows(historyRows ?? []));
        view.setHistoryOpen(true);
      },
    },
    {
      key: 'cancel',
      label: 'Cancelar',
      onClick: () => {
        view.setSelected({ id: row.id, tenantId: row.tenantId });
        view.setCancelOpen(true);
      },
    },
    {
      key: 'remove',
      label: 'Remover',
      onClick: () => {
        void view.mutations.remove(row.id, row.tenantId).then(() => view.list.refresh());
      },
    },
  ];

  return {
    view,
    columns: buildSubscriptionsListColumns({ buildRowActions }),
    mobileConfig: buildSubscriptionsMobileConfig({ buildRowActions }),
    metrics: buildSubscriptionMetrics(view.list.rows),
    statusOptions: subscriptionStatusOptions,
    periodLabel: buildPeriodLabel(view.list.query),
    clearFilters: () => view.list.updateQuery(buildClearFiltersPatch()),
    updateSearch: (search: string) => view.list.updateQuery({ search, page: 1 }),
    updateStatus: (status: string) =>
      view.list.updateQuery({ status: parseSubscriptionStatus(status), page: 1 }),
    updatePlanId: (planId: string) =>
      view.list.updateQuery({ planId: planId || undefined, page: 1 }),
    confirmCancel: () => {
      if (!view.selected) return;
      void view.mutations
        .cancel(view.selected.id, view.selected.tenantId, { immediate: true })
        .then(() => view.list.refresh());
      view.setCancelOpen(false);
    },
    searchValue: view.list.query.search ?? '',
    statusValue: view.list.query.status ?? '',
    planValue: view.list.query.planId ?? '',
    historyDialogRows: view.historyRows.map((item) => ({
      id: item.id,
      primary: `${item.fromPlanId ?? '-'} -> ${item.toPlanId} (${item.changedAt})`,
    })),
  };
};
