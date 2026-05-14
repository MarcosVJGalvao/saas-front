import AddIcon from '@mui/icons-material/Add';
import { DataList } from '@shared/components/data-display/data/DataList';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { ListMetricsGrid } from '@shared/components/data-display/data/ListMetricsGrid';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListDialog } from '@shared/components/feedback/ListDialog';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppButton } from '@shared/components/inputs/AppButton';
import { useSubscriptionsListViewModel } from '@features/subscriptions/hooks/useSubscriptionsListViewModel';

const toDateQueryValue = (value: unknown) => (typeof value === 'string' ? value : undefined);
const rowsPerPageOptions = [10, 20, 50];

interface FilterChangeDependencies {
  updateSearch: (value: string) => void;
  updateStatus: (value: string) => void;
  updateStartDate: (value: string | undefined) => void;
  updateEndDate: (value: string | undefined) => void;
}

const createFilterChangeHandler =
  (dependencies: FilterChangeDependencies) => (name: string, value: unknown) => {
    const actionByName: Record<string, () => void> = {
      search: () => dependencies.updateSearch(String(value)),
      status: () => dependencies.updateStatus(String(value)),
      startDate: () => dependencies.updateStartDate(toDateQueryValue(value)),
      endDate: () => dependencies.updateEndDate(toDateQueryValue(value)),
    };
    const action = actionByName[name];
    if (action) action();
  };

const buildFilterValues = (model: ReturnType<typeof useSubscriptionsListViewModel>) => ({
  search: model.searchValue,
  status: model.statusValue,
  startDate: model.view.list.query.startDate ?? null,
  endDate: model.view.list.query.endDate ?? null,
});

const SubscriptionsListPage = () => {
  const model = useSubscriptionsListViewModel();
  const handleFilterChange = createFilterChangeHandler({
    updateSearch: model.updateSearch,
    updateStatus: model.updateStatus,
    updateStartDate: (startDate) => model.view.list.updateQuery({ startDate, page: 1 }),
    updateEndDate: (endDate) => model.view.list.updateQuery({ endDate, page: 1 }),
  });

  const values = buildFilterValues(model);

  return (
    <>
      <PageHeader
        title="Gestão de Assinaturas"
        subtitle="Gerencie planos ativos, renovações e cobranças"
        actions={
          <AppButton
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => void model.view.navigate('/platform/subscriptions/new')}
          >
            Nova Assinatura
          </AppButton>
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
            mobileOrder: 2,
          },
          {
            type: 'dateRange',
            name: 'period',
            label: 'Período',
            startName: 'startDate',
            endName: 'endDate',
            mobileOrder: 3,
          },
        ]}
        values={values}
        onChange={handleFilterChange}
        onApply={() => undefined}
        onClear={model.clearFilters}
        loading={model.view.list.loading}
      />

      <DataList
        rows={model.view.list.rows}
        columns={model.columns}
        mobileConfig={model.mobileConfig}
        getRowKey={(row) => row.id}
        loading={model.view.list.loading}
        errorMessage={model.view.list.errorMessage}
        emptyTitle="Nenhuma assinatura encontrada"
        emptyDescription="Ajuste os filtros ou cadastre uma nova assinatura."
        pagination={{
          page: Math.max((model.view.list.meta.page ?? 1) - 1, 0),
          rowsPerPage: model.view.list.meta.limit,
          rowsPerPageOptions,
          totalItems: model.view.list.meta.total,
          onPageChange: (nextPage) => model.view.list.updateQuery({ page: nextPage + 1 }),
          onRowsPerPageChange: (nextRowsPerPage) =>
            model.view.list.updateQuery({ limit: nextRowsPerPage, page: 1 }),
        }}
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
