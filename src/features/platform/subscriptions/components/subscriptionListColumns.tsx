import { AppAvatar } from '@shared/components/data-display/AppAvatar';
import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import { AppStack } from '@shared/components/layout/AppStack';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { subscriptionStatusLabelByValue } from '@shared/i18n/pt-BR/enums';
import type { Subscription } from '@features/platform/subscriptions/types/subscriptions';

export interface SubscriptionColumnActions {
  onDetails: (subscription: Subscription) => void;
  onEdit: (subscription: Subscription) => void;
  onHistory: (subscription: Subscription) => void;
  onCancel: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const renderStatus = (subscription: Subscription) => (
  <LocalizedStatusBadge
    label={subscriptionStatusLabelByValue[subscription.status]}
    tone={subscription.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderActions = (subscription: Subscription, actions: SubscriptionColumnActions) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações da assinatura ${subscription.tenant?.name ?? subscription.tenantId}`}
    actions={[
      { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(subscription) },
      { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(subscription) },
      {
        key: 'history',
        label: 'Histórico de plano',
        onClick: () => actions.onHistory(subscription),
      },
      { key: 'cancel', label: 'Cancelar', onClick: () => actions.onCancel(subscription) },
      { key: 'delete', label: 'Excluir', onClick: () => actions.onDelete(subscription) },
    ]}
  />
);

export const buildSubscriptionColumns = (
  actions: SubscriptionColumnActions,
): DataTableColumn<Subscription>[] => [
  {
    key: 'tenant',
    header: 'Cliente',
    render: (subscription) => subscription.tenant?.name ?? subscription.tenantId,
  },
  {
    key: 'plan',
    header: 'Plano',
    render: (subscription) => subscription.plan?.name ?? subscription.planId,
  },
  { key: 'status', header: 'Status', render: renderStatus },
  {
    key: 'startDate',
    header: 'Início',
    render: (subscription) => formatIsoDate(subscription.startDate),
  },
  {
    key: 'renewalDate',
    header: 'Renovação',
    render: (subscription) =>
      subscription.renewalDate ? formatIsoDate(subscription.renewalDate) : '-',
  },
  {
    key: 'priceAtSubscription',
    header: 'Preço contratado',
    render: (subscription) =>
      formatCurrency(subscription.priceAtSubscription, subscription.plan?.currency ?? 'BRL'),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (subscription) => renderActions(subscription, actions),
  },
];

export const buildSubscriptionMobileConfig = (
  actions: SubscriptionColumnActions,
): DataListMobileConfig<Subscription> => ({
  renderTitle: (subscription) => subscription.tenant?.name ?? subscription.tenantId,
  renderAvatar: (subscription) => (
    <AppAvatar>{getInitials(subscription.tenant?.name ?? subscription.tenantId)}</AppAvatar>
  ),
  renderStatus,
  renderActions: (subscription) => renderActions(subscription, actions),
  renderDetails: (subscription) => (
    <AppStack spacing={1}>
      <AppStack
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          columnGap: 1.5,
          rowGap: 1,
        }}
      >
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Plano
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {subscription.plan?.name ?? subscription.planId}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5} sx={{ alignItems: 'flex-end', textAlign: 'right' }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Preço contratado
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {formatCurrency(subscription.priceAtSubscription, subscription.plan?.currency ?? 'BRL')}
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          columnGap: 1.5,
          rowGap: 1,
        }}
      >
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Início
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {formatIsoDate(subscription.startDate)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5} sx={{ alignItems: 'flex-end', textAlign: 'right' }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Renovação
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {subscription.renewalDate ? formatIsoDate(subscription.renewalDate) : '-'}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
