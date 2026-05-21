import { useNavigate } from 'react-router-dom';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { EntitySummaryCards } from '@shared/components/data-display/EntitySummaryCards';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { useClientsListPage } from '@features/platform/clients/hooks/useClientsListPage';

const ClientsListPage = () => {
  const navigate = useNavigate();
  const clientsListPage = useClientsListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Clientes"
        subtitle="Gerencie clientes, tenants, planos e vínculos principais da plataforma."
        actions={
          clientsListPage.can('platform:clients:create') ? (
            <AppButton
              variant="contained"
              onClick={() => {
                void navigate('/platform/clients/onboarding');
              }}
            >
              Novo cliente
            </AppButton>
          ) : undefined
        }
      />
      <EntitySummaryCards cards={clientsListPage.cards} />
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
        values={clientsListPage.filterValues}
        onChange={clientsListPage.onFilterChange}
        onApply={clientsListPage.applyFilters}
        onClear={clientsListPage.clearFilters}
        loading={clientsListPage.clientsList.loading}
      />
      <QueryDataTable
        rows={clientsListPage.clientsList.rows}
        columns={clientsListPage.tableColumns}
        mobileConfig={clientsListPage.mobileConfig}
        loading={clientsListPage.clientsList.loading}
        errorMessage={clientsListPage.clientsList.errorMessage}
        meta={clientsListPage.clientsList.pagination}
        query={clientsListPage.clientsList.queryParams.search ?? ''}
        onQueryChange={(search) => {
          clientsListPage.onFilterChange('query', search);
        }}
        onPageChange={(page) => clientsListPage.clientsList.updateQueryParams({ page })}
        onRowsPerPageChange={(limit) =>
          clientsListPage.clientsList.updateQueryParams({ limit, page: 1 })
        }
        hideToolbar
        emptyTitle="Nenhum cliente encontrado"
        emptyDescription="Ajuste os filtros ou inicie um novo onboarding de cliente."
      />
      <ConfirmDialog
        open={clientsListPage.deleteModal.client !== undefined}
        title="Desativar cliente"
        description={`Confirma a desativação de ${clientsListPage.deleteModal.client?.legalName ?? 'este cliente'}?`}
        confirmLabel="Desativar"
        onCancel={clientsListPage.deleteModal.close}
        onConfirm={() => {
          void clientsListPage.deleteModal.confirm();
        }}
      />
    </AppStack>
  );
};

export default ClientsListPage;
