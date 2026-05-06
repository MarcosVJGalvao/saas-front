import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ListFilters } from '../../../components/common/data/ListFilters';
import { QueryDataTable } from '../../../components/common/data/QueryDataTable';
import { EntitySummaryCards } from '../../../components/common/display/EntitySummaryCards';
import { ConfirmDialog } from '../../../components/common/feedback/ConfirmDialog';
import { PageIntroHeader } from '../../../components/common/page/PageIntroHeader';
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
        loading={model.view.list.loading}
        errorMessage={model.view.list.errorMessage}
        meta={model.view.list.meta}
        query={model.query}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onLimitChange}
        hideToolbar
      />
      <Drawer
        anchor="right"
        open={model.view.selectedClientId !== undefined}
        onClose={() => model.view.setSelectedClientId(undefined)}
      >
        <Stack sx={{ width: 420, p: 2.5 }} spacing={2}>
          <Typography variant="h6">Detalhes do Cliente</Typography>
          {model.view.details.data ? (
            <>
              <Typography variant="h5">{model.view.details.data.legalName}</Typography>
              <Typography color="text.secondary">{model.view.details.data.email}</Typography>
              <Typography>Documento: {model.view.details.data.documentNumber}</Typography>
            </>
          ) : (
            <Typography>Carregando...</Typography>
          )}
        </Stack>
      </Drawer>
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
