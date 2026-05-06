import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { ListFilters } from '../../../components/common/data/ListFilters';
import { QueryDataTable } from '../../../components/common/data/QueryDataTable';
import { EntityDetailsDrawer } from '../../../components/common/details/EntityDetailsDrawer';
import { EntitySummaryCards } from '../../../components/common/display/EntitySummaryCards';
import { ConfirmDialog } from '../../../components/common/feedback/ConfirmDialog';
import { PageIntroHeader } from '../../../components/common/page/PageIntroHeader';
import { useClientDetailsDrawerSchema } from '../../../hooks/clients/useClientDetailsDrawerSchema';
import { useClientsListFilters } from '../../../hooks/clients/useClientsListFilters';
import { useClientsListPageViewModel } from '../../../hooks/clients/useClientsListPageViewModel';

const ClientsListPage = () => {
  const model = useClientsListPageViewModel();
  const filters = useClientsListFilters({
    query: model.query,
    listQuery: model.view.list.query,
    onQueryChange: model.onQueryChange,
    updateQuery: model.view.list.updateQuery,
  });
  const drawerSchema = useClientDetailsDrawerSchema(model.view.details.data, {
    summary: 'Dados gerais',
    academic: 'Organização',
    financial: 'Plano e assinatura',
    subscriptionHistory: 'Histórico da assinatura',
    history: 'Auditoria',
  });

  return (
    <Stack spacing={2.5}>
      <PageIntroHeader {...model.pageHeader} />
      <EntitySummaryCards cards={model.cards} />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Digite para buscar...',
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
            ],
            mobileOrder: 3,
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
        values={filters.filterValues}
        onChange={filters.onFilterChange}
        onApply={filters.applyFilters}
        onClear={filters.clearFilters}
      />
      <QueryDataTable
        rows={model.view.list.rows}
        columns={model.columns}
        mobileConfig={model.mobileConfig}
        loading={model.view.list.loading}
        errorMessage={model.view.list.errorMessage}
        meta={model.view.list.meta}
        query={model.query}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onLimitChange}
        hideToolbar
      />
      <EntityDetailsDrawer
        open={model.view.selectedClientId !== undefined}
        loading={model.view.details.loading}
        error={model.view.details.errorMessage ?? null}
        onClose={() => model.view.setSelectedClientId(undefined)}
        headerData={drawerSchema.headerData}
        tabs={drawerSchema.tabs}
        footerActions={drawerSchema.footerActions}
        emptyTitle="Nenhum cliente selecionado."
        emptyMessage="Selecione um cliente na listagem para visualizar os detalhes."
      />
      <ConfirmDialog
        open={model.view.deleteClientId !== undefined}
        title="Excluir cliente"
        description={`Confirma a exclusão de ${model.view.deleteClientName ?? 'este cliente'}?`}
        confirmLabel="Excluir"
        onCancel={() => model.view.setDeleteClientId(undefined)}
        onConfirm={() => {
          void model.view.confirmDelete();
        }}
      />
      <Button
        variant="outlined"
        startIcon={model.exportActionIcon}
        sx={{ minWidth: 132, alignSelf: { xs: 'stretch', xl: 'auto' } }}
      >
        Exportar
      </Button>
    </Stack>
  );
};

export default ClientsListPage;
