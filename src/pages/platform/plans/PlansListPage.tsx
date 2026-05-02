import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { EntitySearchFilter } from '../../../components/common/data/EntitySearchFilter';
import { QueryDataTable } from '../../../components/common/data/QueryDataTable';
import { ConfirmDialog } from '../../../components/common/feedback/ConfirmDialog';
import { PageHeader } from '../../../components/common/page/PageHeader';
import { usePlansListPageViewModel } from '../../../hooks/plans/usePlansListPageViewModel';

const PlansListPage = () => {
  const model = usePlansListPageViewModel();

  return (
    <>
      <PageHeader
        title="Listagem de Planos"
        subtitle="Gerencie planos, preços e ciclos de cobrança"
        actions={
          <Button
            variant="contained"
            onClick={() => void model.view.navigate('/platform/plans/new')}
          >
            Novo Plano
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <EntitySearchFilter
            value={model.query}
            onChange={model.onQueryChange}
            placeholder="Buscar plano..."
          />
        </Grid>
      </Grid>

      <QueryDataTable
        rows={model.view.list.rows}
        columns={model.columns}
        meta={model.view.list.meta}
        query={model.query}
        onQueryChange={model.onQueryChange}
        loading={model.view.list.loading}
        errorMessage={model.view.list.errorMessage}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onRowsPerPageChange}
        hideToolbar
        emptyTitle="Nenhum plano encontrado"
        emptyDescription="Ajuste os filtros ou cadastre um novo plano."
      />

      <ConfirmDialog
        open={Boolean(model.view.deleteId)}
        title="Remover plano"
        description="Confirma a remoção?"
        confirmLabel="Remover"
        onCancel={() => model.view.setDeleteId(undefined)}
        onConfirm={() => {
          void model.view.confirmDelete();
        }}
      />
    </>
  );
};

export default PlansListPage;
