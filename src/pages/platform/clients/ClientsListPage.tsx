/* eslint-disable complexity */
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { EntitySearchFilter } from '../../../components/common/data/EntitySearchFilter';
import { QueryDataTable } from '../../../components/common/data/QueryDataTable';
import { SelectFilterField } from '../../../components/common/data/SelectFilterField';
import { EntitySummaryCards } from '../../../components/common/display/EntitySummaryCards';
import { ConfirmDialog } from '../../../components/common/feedback/ConfirmDialog';
import { PageIntroHeader } from '../../../components/common/page/PageIntroHeader';
import { useClientsListPageViewModel } from '../../../hooks/clients/useClientsListPageViewModel';

const resolveStatusFilterValue = (statusValue: string): 'active' | 'inactive' | undefined => {
  if (statusValue === 'active') return 'active';
  if (statusValue === 'inactive') return 'inactive';
  return undefined;
};

const ClientsListFilters = ({
  model,
}: {
  model: ReturnType<typeof useClientsListPageViewModel>;
}) => (
  <Stack
    direction={{ xs: 'column', xl: 'row' }}
    spacing={1.5}
    sx={{ alignItems: { xl: 'center' } }}
  >
    <EntitySearchFilter
      value={model.query}
      onChange={model.onQueryChange}
      placeholder="Buscar por cliente, documento ou e-mail..."
    />
    <SelectFilterField
      label="Status"
      value={model.view.list.query.status ?? ''}
      onChange={(statusValue) =>
        model.view.list.updateQuery({
          status: resolveStatusFilterValue(statusValue),
          page: 1,
        })
      }
      options={[
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
      ]}
    />
    <TextField
      fullWidth
      label="Plano"
      value={model.view.list.query.plan ?? ''}
      onChange={(event) =>
        model.view.list.updateQuery({ plan: event.target.value || undefined, page: 1 })
      }
    />
    <TextField
      fullWidth
      label="Segmento"
      value={model.view.list.query.segment ?? ''}
      onChange={(event) =>
        model.view.list.updateQuery({ segment: event.target.value || undefined, page: 1 })
      }
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

const ClientsListPage = () => {
  const model = useClientsListPageViewModel();

  return (
    <Stack spacing={2.5}>
      <PageIntroHeader {...model.pageHeader} />
      <EntitySummaryCards cards={model.cards} />
      <ClientsListFilters model={model} />
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
        confirmColor="error"
        onCancel={() => model.view.setDeleteClientId(undefined)}
        onConfirm={() => {
          void model.view.confirmDelete();
        }}
        loading={model.view.mutations.loading}
      />
    </Stack>
  );
};

export default ClientsListPage;
