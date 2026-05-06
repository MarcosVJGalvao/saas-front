import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { ListFilters } from '../../../components/common/data/ListFilters';
import { ListMetricsGrid } from '../../../components/common/data/ListMetricsGrid';
import { QueryDataTable } from '../../../components/common/data/QueryDataTable';
import { ConfirmDialog } from '../../../components/common/feedback/ConfirmDialog';
import { ListDialog } from '../../../components/common/feedback/ListDialog';
import { PageHeader } from '../../../components/common/page/PageHeader';
import { useSubscriptionsListViewModel } from '../../../hooks/subscriptions/useSubscriptionsListViewModel';

const SubscriptionsListPage = () => {
  const model = useSubscriptionsListViewModel();
  const dateQueryUpdater = (name: 'startDate' | 'endDate') => (value: unknown) =>
    model.view.list.updateQuery({
      [name]: typeof value === 'string' ? value : undefined,
      page: 1,
    });

  const changeHandlers: Record<string, (value: unknown) => void> = {
    search: (value) => model.updateSearch(String(value)),
    status: (value) => model.updateStatus(String(value)),
    planId: (value) => model.updatePlanId(String(value)),
    startDate: dateQueryUpdater('startDate'),
    endDate: dateQueryUpdater('endDate'),
  };

  const handleFilterChange = (name: string, value: unknown) =>
    (changeHandlers[name] ?? (() => undefined))(value);

  const values = {
    search: model.searchValue,
    status: model.statusValue,
    planId: model.planValue,
    date: null,
    startDate: model.view.list.query.startDate ?? null,
    endDate: model.view.list.query.endDate ?? null,
  };

  return (
    <>
      <PageHeader
        title="Gestão de Assinaturas"
        subtitle="Gerencie planos ativos, renovações e cobranças"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => void model.view.navigate('/platform/subscriptions/new')}
          >
            Nova Assinatura
          </Button>
        }
      />
      <ListMetricsGrid loading={model.view.list.loading} items={model.metrics} />

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
            options: model.statusOptions.map((item) => ({ label: item.label, value: item.value })),
            mobileOrder: 3,
          },
          {
            type: 'select',
            name: 'planId',
            label: 'Categoria',
            placeholder: 'Selecione um plano',
            options: model.view.plans.map((plan) => ({ label: plan.name, value: plan.id })),
            mobileOrder: 2,
          },
          {
            type: 'date',
            name: 'date',
            label: 'Data',
            placeholder: 'Selecione uma data',
            mobileOrder: 4,
          },
          {
            type: 'dateRange',
            name: 'period',
            label: 'Período',
            startName: 'startDate',
            endName: 'endDate',
            mobileOrder: 5,
          },
        ]}
        values={values}
        onChange={handleFilterChange}
        onApply={() => undefined}
        onClear={model.clearFilters}
        loading={model.view.list.loading}
      />

      <QueryDataTable
        rows={model.view.list.rows}
        columns={model.columns}
        meta={model.view.list.meta}
        query={model.searchValue}
        onQueryChange={model.updateSearch}
        loading={model.view.list.loading}
        errorMessage={model.view.list.errorMessage}
        onPageChange={(page) => model.view.list.updateQuery({ page })}
        onRowsPerPageChange={(limit) => model.view.list.updateQuery({ limit, page: 1 })}
        hideToolbar
        emptyTitle="Nenhuma assinatura encontrada"
        emptyDescription="Ajuste os filtros ou cadastre uma nova assinatura."
      />

      <ConfirmDialog
        open={model.view.cancelOpen}
        title="Cancelar assinatura"
        description="Escolha como cancelar."
        confirmLabel="Imediato"
        onCancel={() => model.view.setCancelOpen(false)}
        onConfirm={model.confirmCancel}
      />
      <ListDialog
        open={model.view.historyOpen}
        title="Histórico de plano"
        onClose={() => model.view.setHistoryOpen(false)}
        rows={model.historyDialogRows}
      />
    </>
  );
};

export default SubscriptionsListPage;
