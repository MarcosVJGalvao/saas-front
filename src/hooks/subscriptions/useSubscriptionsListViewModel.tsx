import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ListMetricItem } from '../../components/common/data/ListMetricsGrid';
import type {
  DataListColumn,
  DataListMobileConfig,
} from '../../components/common/data/dataList.types';
import { RowActionsMenu } from '../../components/common/data/RowActionsMenu';
import { LocalizedStatusBadge } from '../../components/common/display/LocalizedStatusBadge';
import type { Subscription, SubscriptionsQueryParams } from '../../models/subscriptions';
import { spacingScale } from '../../theme/spacing';
import { useSubscriptionsListPage } from './useSubscriptionsListPage';

const statusLabelByValue: Record<Subscription['status'], string> = {
  active: 'Ativa',
  canceled: 'Cancelada',
  past_due: 'Em atraso',
  trialing: 'Em trial',
  blocked: 'Bloqueada',
};

const subscriptionStatusOptions: ReadonlyArray<{ value: Subscription['status']; label: string }> = [
  { value: 'active', label: 'Ativa' },
  { value: 'trialing', label: 'Em trial' },
  { value: 'canceled', label: 'Cancelada' },
  { value: 'past_due', label: 'Em atraso' },
  { value: 'blocked', label: 'Bloqueada' },
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

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('pt-BR') : '-';

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

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

  const columns: DataListColumn<Subscription>[] = [
    {
      id: 'tenant',
      label: 'Cliente',
      render: (row) => row.tenant?.name ?? row.tenantId,
    },
    {
      id: 'plan',
      label: 'Plano Atual',
      visibility: { desktop: true, tablet: false, mobile: true },
      render: (row) => row.plan?.name ?? row.planId,
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => {
        const isActive = row.status === 'active';
        return (
          <LocalizedStatusBadge
            label={statusLabelByValue[row.status]}
            tone={isActive ? 'active' : 'neutral'}
          />
        );
      },
    },
    {
      id: 'start',
      label: 'Início',
      render: (row) => formatDate(row.startDate),
    },
    {
      id: 'renewal',
      label: 'Renovação',
      visibility: { desktop: true, tablet: false, mobile: true },
      render: (row) => formatDate(row.renewalDate),
    },
    {
      id: 'actions',
      label: 'Ações',
      align: 'right',
      width: '72px',
      render: (row) => (
        <RowActionsMenu
          triggerAriaLabel={`Abrir ações de ${row.tenant?.name ?? row.tenantId}`}
          actions={buildRowActions(row)}
        />
      ),
    },
  ];

  const mobileConfig: DataListMobileConfig<Subscription> = {
    renderTitle: (row) => row.tenant?.name ?? row.tenantId,
    renderAvatar: (row) => <Avatar>{getInitials(row.tenant?.name ?? row.tenantId)}</Avatar>,
    renderStatus: (row) => (
      <LocalizedStatusBadge
        label={statusLabelByValue[row.status]}
        tone={row.status === 'active' ? 'active' : 'neutral'}
      />
    ),
    renderActions: (row) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações de ${row.tenant?.name ?? row.tenantId}`}
        actions={buildRowActions(row)}
      />
    ),
    renderDetails: (row) => (
      <Stack spacing={spacingScale.xs}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Stack spacing={spacingScale.xxs} sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Plano
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.plan?.name ?? row.planId}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Início
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Renovação
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {formatDate(row.startDate)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {formatDate(row.renewalDate)}
          </Typography>
        </Stack>
      </Stack>
    ),
  };

  return {
    view,
    columns,
    mobileConfig,
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
