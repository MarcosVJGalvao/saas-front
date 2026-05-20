import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListDialog } from '@shared/components/feedback/ListDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { ListMetricsGrid } from '@shared/components/data-display/data/ListMetricsGrid';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { subscriptionStatusLabelByValue } from '@shared/i18n/pt-BR/enums';
import { useSubscriptionsListPage } from '@features/platform/subscriptions/hooks/useSubscriptionsListPage';

const isSubscriptionStatus = (
  value: string,
): value is 'active' | 'canceled' | 'past_due' | 'trialing' | 'blocked' =>
  value === 'active' ||
  value === 'canceled' ||
  value === 'past_due' ||
  value === 'trialing' ||
  value === 'blocked';

const SubscriptionsListPage = () => {
  const subscriptionsPage = useSubscriptionsListPage();
  const activeSubscriptions = subscriptionsPage.subscriptionsList.rows.filter(
    (subscription) => subscription.status === 'active',
  ).length;
  const trialSubscriptions = subscriptionsPage.subscriptionsList.rows.filter(
    (subscription) => subscription.status === 'trialing',
  ).length;
  const canceledSubscriptions = subscriptionsPage.subscriptionsList.rows.filter(
    (subscription) => subscription.status === 'canceled',
  ).length;
  const monthlyRecurringRevenue = subscriptionsPage.subscriptionsList.rows.reduce(
    (totalValue, subscription) => totalValue + Number(subscription.priceAtSubscription || 0),
    0,
  );

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Assinaturas"
        subtitle="Gerencie ciclos, renovações, histórico de plano e cancelamentos."
        actionLabel="Nova assinatura"
        onAction={subscriptionsPage.onCreate}
      />
      <ListMetricsGrid
        loading={subscriptionsPage.subscriptionsList.loading}
        items={[
          {
            key: 'active',
            title: 'Assinaturas ativas',
            value: String(activeSubscriptions),
            icon: <GroupOutlinedIcon color="primary" />,
            iconTone: 'primary',
            variationText: 'Base ativa atual',
            variationType: 'positive',
          },
          {
            key: 'trialing',
            title: 'Em trial',
            value: String(trialSubscriptions),
            icon: <ScheduleOutlinedIcon color="warning" />,
            iconTone: 'warning',
            variationText: 'Trial em andamento',
            variationType: 'positive',
          },
          {
            key: 'canceled',
            title: 'Canceladas',
            value: String(canceledSubscriptions),
            icon: <HighlightOffOutlinedIcon color="error" />,
            iconTone: 'error',
            variationText: 'Assinaturas encerradas',
            variationType: 'neutral',
          },
          {
            key: 'mrr',
            title: 'MRR',
            value: formatCurrency(monthlyRecurringRevenue, 'BRL'),
            icon: <MoneyOutlinedIcon color="success" />,
            iconTone: 'success',
            variationText: 'Receita recorrente mensal',
            variationType: 'positive',
          },
        ]}
      />
      {subscriptionsPage.actionErrorMessage ? (
        <AppAlert severity="error">{subscriptionsPage.actionErrorMessage}</AppAlert>
      ) : null}
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'search',
            label: 'Buscar',
            placeholder: 'Buscar por cliente...',
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              ...Object.entries(subscriptionStatusLabelByValue).map(([value, label]) => ({
                value,
                label,
              })),
            ],
            mobileOrder: 2,
          },
        ]}
        values={{
          search: subscriptionsPage.subscriptionsList.queryParams.search ?? '',
          status: subscriptionsPage.subscriptionsList.queryParams.status ?? '',
        }}
        onChange={(filterKey, filterValue) => {
          if (filterKey === 'search') {
            subscriptionsPage.subscriptionsList.updateQueryParams({
              search: typeof filterValue === 'string' ? filterValue : undefined,
            });
          }

          if (filterKey === 'status') {
            subscriptionsPage.subscriptionsList.updateQueryParams({
              status:
                typeof filterValue === 'string' && isSubscriptionStatus(filterValue)
                  ? filterValue
                  : undefined,
            });
          }
        }}
        onApply={() => undefined}
        onClear={() => {
          subscriptionsPage.subscriptionsList.updateQueryParams({
            search: undefined,
            status: undefined,
            page: 1,
          });
        }}
        loading={subscriptionsPage.subscriptionsList.loading || subscriptionsPage.actionLoading}
      />
      <QueryDataTable
        rows={subscriptionsPage.subscriptionsList.rows}
        columns={subscriptionsPage.tableColumns}
        mobileConfig={subscriptionsPage.mobileConfig}
        getRowId={(subscription) => subscription.id}
        meta={subscriptionsPage.subscriptionsList.pagination}
        query={subscriptionsPage.subscriptionsList.queryParams.search ?? ''}
        onQueryChange={(search) => {
          subscriptionsPage.subscriptionsList.updateQueryParams({ search });
        }}
        loading={subscriptionsPage.subscriptionsList.loading}
        errorMessage={subscriptionsPage.subscriptionsList.errorMessage}
        onRetry={() => {
          void subscriptionsPage.subscriptionsList.reload();
        }}
        onPageChange={(page) => {
          subscriptionsPage.subscriptionsList.updateQueryParams({ page });
        }}
        onRowsPerPageChange={(limit) => {
          subscriptionsPage.subscriptionsList.updateQueryParams({ limit, page: 1 });
        }}
        hideToolbar
        emptyTitle="Nenhuma assinatura encontrada"
        emptyDescription="Cadastre assinaturas para gerenciar clientes e planos ativos."
      />
      <ConfirmDialog
        open={subscriptionsPage.cancelDialog.open}
        title="Cancelar assinatura"
        description="Deseja cancelar a assinatura imediatamente?"
        confirmLabel="Cancelar assinatura"
        onCancel={subscriptionsPage.cancelDialog.close}
        onConfirm={() => {
          void subscriptionsPage.cancelDialog.confirm();
        }}
      />
      <ConfirmDialog
        open={subscriptionsPage.deleteDialog.open}
        title="Excluir assinatura"
        description="Deseja excluir a assinatura selecionada?"
        confirmLabel="Excluir"
        onCancel={subscriptionsPage.deleteDialog.close}
        onConfirm={() => {
          void subscriptionsPage.deleteDialog.confirm();
        }}
      />
      <ListDialog
        open={subscriptionsPage.historyDialog.open}
        title="Histórico de plano"
        onClose={subscriptionsPage.historyDialog.close}
        rows={subscriptionsPage.historyDialog.rows}
      />
    </AppStack>
  );
};

export default SubscriptionsListPage;
