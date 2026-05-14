import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import type { ListMetricItem } from '@shared/components/data-display/data/ListMetricsGrid';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import {
  RowActionsMenu,
  type RowActionItem,
} from '@shared/components/data-display/data/RowActionsMenu';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppAvatar } from '@shared/components/data-display/AppAvatar';
import { AppText } from '@shared/components/data-display/AppText';
import { AppStack } from '@shared/components/layout/AppStack';
import type { Subscription } from '@features/subscriptions/types/subscriptions';
import { spacingScale } from '@theme/spacing';

interface SubscriptionsListPresentationParams {
  buildRowActions: (row: Subscription) => RowActionItem[];
}

const statusLabelByValue: Record<Subscription['status'], string> = {
  active: 'Ativa',
  canceled: 'Cancelada',
  past_due: 'Em atraso',
  trialing: 'Em trial',
  blocked: 'Bloqueada',
};

export const subscriptionStatusOptions: ReadonlyArray<{
  value: Subscription['status'];
  label: string;
}> = [
  { value: 'active', label: 'Ativa' },
  { value: 'trialing', label: 'Em trial' },
  { value: 'canceled', label: 'Cancelada' },
  { value: 'past_due', label: 'Em atraso' },
  { value: 'blocked', label: 'Bloqueada' },
];

export const parseSubscriptionStatus = (rawValue: string): Subscription['status'] | undefined =>
  subscriptionStatusOptions.find((option) => option.value === rawValue)?.value;

const formatCurrency = (value: number | string): string => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return String(value);
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(normalized);
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('pt-BR') : '-';

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const renderSubscriptionStatus = (row: Subscription) => (
  <LocalizedStatusBadge
    label={statusLabelByValue[row.status]}
    tone={row.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderRowActions = (
  row: Subscription,
  buildRowActions: (row: Subscription) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações de ${row.tenant?.name ?? row.tenantId}`}
    actions={buildRowActions(row)}
  />
);

export const buildSubscriptionMetrics = (
  rows: ReadonlyArray<Subscription>,
): ReadonlyArray<ListMetricItem> => {
  const active = rows.filter((row) => row.status === 'active').length;
  const trialing = rows.filter((row) => row.status === 'trialing').length;
  const canceled = rows.filter((row) => row.status === 'canceled').length;
  const mrr = rows.reduce((acc, row) => acc + (Number(row.priceAtSubscription) || 0), 0);

  return [
    {
      key: 'active',
      title: 'Assinaturas Ativas',
      value: String(active),
      icon: <GroupOutlinedIcon color="primary" />,
      iconTone: 'primary',
      variationText: '100% vs mês anterior',
      variationType: 'positive',
    },
    {
      key: 'trialing',
      title: 'Em Trial',
      value: String(trialing),
      icon: <ScheduleOutlinedIcon color="warning" />,
      iconTone: 'warning',
      variationText: '50% vs mês anterior',
      variationType: 'positive',
    },
    {
      key: 'canceled',
      title: 'Canceladas (mês)',
      value: String(canceled),
      icon: <HighlightOffOutlinedIcon color="error" />,
      iconTone: 'error',
      variationText: '0% vs mês anterior',
      variationType: 'neutral',
    },
    {
      key: 'mrr',
      title: 'MRR',
      value: formatCurrency(mrr),
      icon: <MoneyOutlinedIcon color="success" />,
      iconTone: 'success',
      variationText: '100% vs mês anterior',
      variationType: 'positive',
    },
  ];
};

export const buildSubscriptionsListColumns = ({
  buildRowActions,
}: SubscriptionsListPresentationParams): DataTableColumn<Subscription>[] => [
  {
    key: 'tenant',
    header: 'Cliente',
    render: (row) => row.tenant?.name ?? row.tenantId,
  },
  {
    key: 'plan',
    header: 'Plano Atual',
    visibility: { desktop: true, tablet: false, mobile: true },
    render: (row) => row.plan?.name ?? row.planId,
  },
  {
    key: 'status',
    header: 'Status',
    render: renderSubscriptionStatus,
  },
  {
    key: 'start',
    header: 'Início',
    render: (row) => formatDate(row.startDate),
  },
  {
    key: 'renewal',
    header: 'Renovação',
    visibility: { desktop: true, tablet: false, mobile: true },
    render: (row) => formatDate(row.renewalDate),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    width: '72px',
    render: (row) => renderRowActions(row, buildRowActions),
  },
];

export const buildSubscriptionsMobileConfig = ({
  buildRowActions,
}: SubscriptionsListPresentationParams): DataListMobileConfig<Subscription> => ({
  renderTitle: (row) => row.tenant?.name ?? row.tenantId,
  renderAvatar: (row) => <AppAvatar>{getInitials(row.tenant?.name ?? row.tenantId)}</AppAvatar>,
  renderStatus: renderSubscriptionStatus,
  renderActions: (row) => renderRowActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={spacingScale.xs}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between' }}>
        <AppStack spacing={spacingScale.xxs} sx={{ minWidth: 0 }}>
          <AppText variant="body2" color="text.secondary">
            Plano
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {row.plan?.name ?? row.planId}
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack direction="row" sx={{ justifyContent: 'space-between' }}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Início
        </AppText>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Renovação
        </AppText>
      </AppStack>
      <AppStack direction="row" sx={{ justifyContent: 'space-between' }}>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {formatDate(row.startDate)}
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {formatDate(row.renewalDate)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
