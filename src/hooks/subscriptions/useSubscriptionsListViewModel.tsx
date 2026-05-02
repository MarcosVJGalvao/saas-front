import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import Chip from '@mui/material/Chip';
import type { DataTableColumn } from '../../components/common/data/DataTable';
import type { ListMetricItem } from '../../components/common/data/ListMetricsGrid';
import { RowActionsMenu } from '../../components/common/data/RowActionsMenu';
import type { Subscription, SubscriptionsQueryParams } from '../../models/subscriptions';
import { useSubscriptionsListPage } from './useSubscriptionsListPage';

const statusColorByValue: Record<Subscription['status'], 'success' | 'error' | 'warning'> = {
  active: 'success',
  canceled: 'error',
  past_due: 'warning',
  trialing: 'warning',
  blocked: 'error',
};

const subscriptionStatusOptions: ReadonlyArray<{ value: Subscription['status']; label: string }> = [
  { value: 'active', label: 'active' },
  { value: 'trialing', label: 'trialing' },
  { value: 'canceled', label: 'canceled' },
  { value: 'past_due', label: 'past_due' },
  { value: 'blocked', label: 'blocked' },
];

const formatCurrency = (value: number | string): string => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return String(value);
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(normalized);
};

const parseSubscriptionStatus = (rawValue: string): Subscription['status'] | undefined =>
  subscriptionStatusOptions.find((option) => option.value === rawValue)?.value;

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
  const rows = view.list.rows;
  const active = rows.filter((row) => row.status === 'active').length;
  const trialing = rows.filter((row) => row.status === 'trialing').length;
  const canceled = rows.filter((row) => row.status === 'canceled').length;
  const mrr = rows.reduce((acc, row) => acc + (Number(row.priceAtSubscription) || 0), 0);

  const metrics: ReadonlyArray<ListMetricItem> = [
    {
      key: 'active',
      title: 'Assinaturas Ativas',
      value: String(active),
      icon: <GroupOutlinedIcon color="primary" />,
      iconColor: '#1976d2',
      variationText: '100% vs mês anterior',
      variationType: 'positive',
    },
    {
      key: 'trialing',
      title: 'Em Trial',
      value: String(trialing),
      icon: <ScheduleOutlinedIcon color="warning" />,
      iconColor: '#ed6c02',
      variationText: '50% vs mês anterior',
      variationType: 'positive',
    },
    {
      key: 'canceled',
      title: 'Canceladas (mês)',
      value: String(canceled),
      icon: <HighlightOffOutlinedIcon color="error" />,
      iconColor: '#d32f2f',
      variationText: '0% vs mês anterior',
      variationType: 'neutral',
    },
    {
      key: 'mrr',
      title: 'MRR',
      value: formatCurrency(mrr),
      icon: <MoneyOutlinedIcon color="success" />,
      iconColor: '#2e7d32',
      variationText: '100% vs mês anterior',
      variationType: 'positive',
    },
  ];

  const columns: DataTableColumn<Subscription>[] = [
    { key: 'tenant', header: 'Cliente', render: (row) => row.tenant?.name ?? row.tenantId },
    { key: 'plan', header: 'Plano Atual', render: (row) => row.plan?.name ?? row.planId },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Chip size="small" color={statusColorByValue[row.status]} label={`• ${row.status}`} />
      ),
    },
    {
      key: 'start',
      header: 'Início',
      render: (row) => new Date(row.startDate).toLocaleDateString('pt-BR'),
    },
    {
      key: 'renewal',
      header: 'Renovação',
      render: (row) =>
        row.renewalDate ? new Date(row.renewalDate).toLocaleDateString('pt-BR') : '-',
    },
    { key: 'value', header: 'Valor', render: (row) => formatCurrency(row.priceAtSubscription) },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      render: (row) => (
        <RowActionsMenu
          actions={[
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
                void view.navigate(
                  `/platform/subscriptions/${row.id}/edit?tenantId=${row.tenantId}`,
                ),
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
          ]}
        />
      ),
    },
  ];

  return {
    view,
    columns,
    metrics,
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
