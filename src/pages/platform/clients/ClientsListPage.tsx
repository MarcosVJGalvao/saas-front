import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ClientFilters } from '../../../components/clients/ClientFilters';
import { ClientsTable } from '../../../components/clients/ClientsTable';
import { DeleteClientDialog } from '../../../components/clients/DeleteClientDialog';
import { SearchBar } from '../../../components/common/data/SearchBar';
import { EntitySummaryCards } from '../../../components/common/display/EntitySummaryCards';
import { PageIntroHeader } from '../../../components/common/page/PageIntroHeader';
import { useClientsListPageViewModel } from '../../../hooks/clients/useClientsListPageViewModel';

const ClientsListPage = () => {
  const model = useClientsListPageViewModel();

  return (
    <Stack spacing={2.5}>
      <PageIntroHeader {...model.pageHeader} />
      <EntitySummaryCards cards={model.cards} />
      <Stack
        direction={{ xs: 'column', xl: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { xl: 'center' } }}
      >
        <SearchBar
          value={model.query}
          onChange={model.onQueryChange}
          placeholder="Buscar por cliente, documento ou e-mail..."
          sx={{ maxWidth: { xs: '100%', xl: 380 } }}
        />
        <ClientFilters value={model.view.list.query} onChange={model.view.list.updateQuery} />
        <Button
          variant="outlined"
          startIcon={model.exportActionIcon}
          sx={{ minWidth: 132, alignSelf: { xs: 'stretch', xl: 'auto' } }}
        >
          Exportar
        </Button>
      </Stack>
      <ClientsTable
        rows={model.view.list.rows}
        loading={model.view.list.loading}
        errorMessage={model.view.list.errorMessage}
        page={model.view.list.meta.page}
        limit={model.view.list.meta.limit}
        total={model.view.list.meta.total}
        query={model.query}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onLimitChange={model.onLimitChange}
        onView={model.view.setSelectedClientId}
        onEdit={model.onEdit}
        onDelete={model.view.setDeleteClientId}
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
      <DeleteClientDialog
        open={model.view.deleteClientId !== undefined}
        clientName={model.view.deleteClientName}
        loading={model.view.mutations.loading}
        onCancel={() => model.view.setDeleteClientId(undefined)}
        onConfirm={() => {
          void model.view.confirmDelete();
        }}
      />
    </Stack>
  );
};

export default ClientsListPage;
