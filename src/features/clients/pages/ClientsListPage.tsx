import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { ContextualDetailsDrawer } from '@shared/components/data-display/details/ContextualDetailsDrawer';
import { EntitySummaryCards } from '@shared/components/data-display/EntitySummaryCards';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppBox } from '@shared/components/layout/AppBox';
import { buildClientDetailsDrawerSchema } from '@features/clients/components/clientDetailsDrawerSchema';
import { useClientsListPageViewModel } from '@features/clients/hooks/useClientsListPageViewModel';

const ClientsListPage = () => {
  const model = useClientsListPageViewModel();
  const isDetailsOpen = model.view.selectedClientId !== undefined;
  const closeDetails = () => model.view.setSelectedClientId(undefined);
  const drawerSchema = buildClientDetailsDrawerSchema(model.view.details.data, {
    summary: 'Dados gerais',
    academic: 'Organização',
    financial: 'Plano',
    subscriptionHistory: 'Histórico da assinatura',
    history: 'Auditoria',
  });

  return (
    <ContextualDetailsDrawer
      open={isDetailsOpen}
      loading={model.view.details.loading}
      error={model.view.details.errorMessage ?? null}
      onClose={closeDetails}
      headerData={drawerSchema.headerData}
      tabs={drawerSchema.tabs}
      footerActions={drawerSchema.footerActions}
      emptyTitle="Nenhum cliente selecionado."
      emptyMessage="Selecione um cliente na listagem para visualizar os detalhes."
    >
      <PageHeader
        {...model.pageHeader}
        actions={
          <AppButton variant="outlined" startIcon={model.exportActionIcon} sx={{ minWidth: 132 }}>
            Exportar
          </AppButton>
        }
      />
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
        values={model.filters.filterValues}
        onChange={model.filters.onFilterChange}
        onApply={model.filters.applyFilters}
        onClear={model.filters.clearFilters}
      />
      <AppBox id="clients-details-container" sx={{ position: 'relative' }}>
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
      </AppBox>
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
    </ContextualDetailsDrawer>
  );
};

export default ClientsListPage;
