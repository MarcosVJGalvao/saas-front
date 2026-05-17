import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { ContextualDetailsDrawer } from '@shared/components/data-display/details/ContextualDetailsDrawer';
import { EntitySummaryCards } from '@shared/components/data-display/EntitySummaryCards';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppBox } from '@shared/components/layout/AppBox';
import { buildClientDetailsDrawerSchema } from '@features/platform/clients/components/clientDetailsDrawerSchema';
import { detailsDrawerContentOffset } from '@features/platform/clients/components/clientsListPresentation';
import { useClientsListPageViewModel } from '@features/platform/clients/hooks/useClientsListPageViewModel';

const ClientsListPage = () => {
  const model = useClientsListPageViewModel();
  const isDetailsOpen = model.view.selectedClientId !== undefined;
  const closeDetails = () => model.view.setSelectedClientId(undefined);
  const drawerSchema = buildClientDetailsDrawerSchema(
    model.view.details.data,
    {
      summary: 'Dados gerais',
      academic: 'Organização',
      financial: 'Plano',
      subscriptionHistory: 'Histórico da assinatura',
      history: 'Auditoria',
    },
    {
      onEditClient: (client) => {
        void model.view.navigate(`/platform/clients/${client.id}/edit`);
      },
      onDeactivateClient: (client) => {
        model.view.setDeleteClientId(client.id);
        model.view.setSelectedClientId(undefined);
      },
    },
  );

  return (
    <>
      <AppBox
        sx={{
          minWidth: 0,
          pr: isDetailsOpen ? detailsDrawerContentOffset : 0,
          transition: (theme) => theme.transitions.create('padding-right'),
        }}
      >
        <PageHeader
          title={model.pageHeader.title}
          subtitle={model.pageHeader.subtitle}
          actionLabel={model.pageHeader.actionLabel}
          actionIcon={model.pageHeader.actionIcon}
          canShowAction={model.pageHeader.canShowAction}
          onAction={model.pageHeader.onAction}
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
        title="Desativar cliente"
        description={`Confirma a desativação de ${model.view.deleteClientName ?? 'este cliente'}?`}
        confirmLabel="Desativar"
        onCancel={() => model.view.setDeleteClientId(undefined)}
        onConfirm={() => {
          void model.view.confirmDelete();
        }}
      />
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
      />
    </>
  );
};

export default ClientsListPage;
