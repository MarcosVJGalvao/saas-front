import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DeletePlanDialog } from '../../../components/plans/DeletePlanDialog';
import { PlanFilters } from '../../../components/plans/PlanFilters';
import { PlansTable } from '../../../components/plans/PlansTable';
import { usePlansListPage } from '../../../hooks/plans/usePlansListPage';

const PlansListPage = () => {
  const view = usePlansListPage();
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Listagem de Planos</Typography>
      <Button variant="contained" onClick={() => void view.navigate('/platform/plans/new')}>
        Novo Plano
      </Button>
      <PlanFilters value={view.list.query} onChange={view.list.updateQuery} />
      <PlansTable
        rows={view.list.rows}
        loading={view.list.loading}
        errorMessage={view.list.errorMessage}
        page={view.list.meta.page}
        limit={view.list.meta.limit}
        total={view.list.meta.total}
        query={view.list.query.search ?? ''}
        onQueryChange={(search) => view.list.updateQuery({ search, page: 1 })}
        onPageChange={(page) => view.list.updateQuery({ page })}
        onLimitChange={(limit) => view.list.updateQuery({ limit, page: 1 })}
        onView={(id) => void view.navigate(`/platform/plans/${id}`)}
        onEdit={(id) => void view.navigate(`/platform/plans/${id}/edit`)}
        onDelete={view.setDeleteId}
      />
      <DeletePlanDialog
        open={Boolean(view.deleteId)}
        onCancel={() => view.setDeleteId(undefined)}
        onConfirm={() => {
          void view.confirmDelete();
        }}
      />
    </Stack>
  );
};

export default PlansListPage;
