import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { ActionButtons } from '../../../components/common/actions/ActionButtons';
import { CancelSubscriptionDialog } from '../../../components/subscriptions/CancelSubscriptionDialog';
import { MetricsCards } from '../../../components/subscriptions/MetricsCards';
import { SubscriptionHistoryDialog } from '../../../components/subscriptions/SubscriptionHistoryDialog';
import { SubscriptionsFilters } from '../../../components/subscriptions/SubscriptionsFilters';
import { SubscriptionsTable } from '../../../components/subscriptions/SubscriptionsTable';
import { useSubscriptionsListPage } from '../../../hooks/subscriptions/useSubscriptionsListPage';

const SubscriptionsListPage = () => {
  const view = useSubscriptionsListPage();
  const theme = useTheme();

  const activeCount = view.list.rows.filter((row) => row.status === 'active').length;
  const trialCount = view.list.rows.filter((row) => row.status === 'trialing').length;
  const canceledCount = view.list.rows.filter((row) => row.status === 'canceled').length;
  const mrr = view.list.rows.reduce((acc, row) => acc + (Number(row.priceAtSubscription) || 0), 0);

  return (
    <Container
      maxWidth={false}
      sx={{
        py: theme.spacing(0.5),
        px: theme.spacing(1),
        bgcolor: theme.palette.background.default,
      }}
    >
      <Stack spacing={theme.spacing(2)}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Stack spacing={theme.spacing(1)}>
            <Typography variant="h4">Gestão de Assinaturas</Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie planos ativos, renovações e cobranças
            </Typography>
          </Stack>

          <ActionButtons
            actions={[
              {
                type: 'custom',
                label: 'Nova Assinatura',
                onClick: () => void view.navigate('/platform/subscriptions/new'),
                startIcon: <AddIcon fontSize="small" />,
              },
            ]}
            fullWidthOnMobile={false}
          />
        </Stack>

        <MetricsCards
          loading={view.list.loading}
          active={activeCount}
          trialing={trialCount}
          canceled={canceledCount}
          mrr={mrr}
        />

        <SubscriptionsTable
          rows={view.list.rows}
          loading={view.list.loading}
          errorMessage={view.list.errorMessage}
          page={view.list.meta.page}
          limit={view.list.meta.limit}
          total={view.list.meta.total}
          query={view.list.query.search ?? ''}
          onQueryChange={(search) => view.list.updateQuery({ search, page: 1 })}
          onPageChange={(page) => view.list.updateQuery({ page })}
          onLimitChange={(limit) => view.list.updateQuery({ limit, page: 1 })}
          onView={(id, tenantId) =>
            void view.navigate(`/platform/subscriptions/${id}?tenantId=${tenantId}`)
          }
          onEdit={(id, tenantId) =>
            void view.navigate(`/platform/subscriptions/${id}/edit?tenantId=${tenantId}`)
          }
          onHistory={(id, tenantId) => {
            view.setSelected({ id, tenantId });
            void view.mutations
              .history(id, tenantId)
              .then((rows) => view.setHistoryRows(rows ?? []));
            view.setHistoryOpen(true);
          }}
          onCancel={(id, tenantId) => {
            view.setSelected({ id, tenantId });
            view.setCancelOpen(true);
          }}
          onDelete={(id, tenantId) => {
            void view.mutations.remove(id, tenantId).then(() => view.list.refresh());
          }}
          toolbarContent={
            <SubscriptionsFilters
              value={view.list.query}
              plans={view.plans}
              onChange={view.list.updateQuery}
            />
          }
        />

        <CancelSubscriptionDialog
          open={view.cancelOpen}
          onCancel={() => view.setCancelOpen(false)}
          onConfirmImmediate={() => {
            if (!view.selected) return;
            void view.mutations
              .cancel(view.selected.id, view.selected.tenantId, { immediate: true })
              .then(() => view.list.refresh());
            view.setCancelOpen(false);
          }}
          onConfirmPeriodEnd={() => {
            if (!view.selected) return;
            void view.mutations
              .cancel(view.selected.id, view.selected.tenantId, { immediate: false })
              .then(() => view.list.refresh());
            view.setCancelOpen(false);
          }}
        />

        <SubscriptionHistoryDialog
          open={view.historyOpen}
          onClose={() => view.setHistoryOpen(false)}
          rows={view.historyRows}
        />
      </Stack>
    </Container>
  );
};

export default SubscriptionsListPage;
