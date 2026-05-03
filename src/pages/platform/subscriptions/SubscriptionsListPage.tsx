import AddIcon from '@mui/icons-material/Add';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { EntitySearchFilter } from '../../../components/common/data/EntitySearchFilter';
import { ListMetricsGrid } from '../../../components/common/data/ListMetricsGrid';
import { QueryDataTable } from '../../../components/common/data/QueryDataTable';
import { SelectFilterField } from '../../../components/common/data/SelectFilterField';
import { ConfirmDialog } from '../../../components/common/feedback/ConfirmDialog';
import { ListDialog } from '../../../components/common/feedback/ListDialog';
import { PageHeader } from '../../../components/common/page/PageHeader';
import { useSubscriptionsListViewModel } from '../../../hooks/subscriptions/useSubscriptionsListViewModel';

const SubscriptionsListPage = () => {
  const model = useSubscriptionsListViewModel();

  return (
    <>
      <PageHeader
        title="Gestão de Assinaturas"
        subtitle="Gerencie planos ativos, renovações e cobranças"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => void model.view.navigate('/platform/subscriptions/new')}
          >
            Nova Assinatura
          </Button>
        }
      />

      <ListMetricsGrid loading={model.view.list.loading} items={model.metrics} />

      <Grid container spacing={2} sx={{ mb: 2.75, alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <EntitySearchFilter
            value={model.searchValue}
            onChange={model.updateSearch}
            placeholder="Buscar por cliente..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <SelectFilterField
            label="Status"
            value={model.statusValue}
            options={model.statusOptions}
            onChange={model.updateStatus}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <SelectFilterField
            label="Plano"
            value={model.planValue}
            options={model.view.plans.map((plan) => ({ value: plan.id, label: plan.name }))}
            onChange={model.updatePlanId}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 2 }}>
          <TextField
            fullWidth
            label="Período"
            value={model.periodLabel}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<FilterListOutlinedIcon fontSize="small" />}
            onClick={model.clearFilters}
          >
            Limpar filtros
          </Button>
        </Grid>
      </Grid>

      <QueryDataTable
        rows={model.view.list.rows}
        columns={model.columns}
        meta={model.view.list.meta}
        query={model.searchValue}
        onQueryChange={model.updateSearch}
        loading={model.view.list.loading}
        errorMessage={model.view.list.errorMessage}
        onPageChange={(page) => model.view.list.updateQuery({ page })}
        onRowsPerPageChange={(limit) => model.view.list.updateQuery({ limit, page: 1 })}
        hideToolbar
        emptyTitle="Nenhuma assinatura encontrada"
        emptyDescription="Ajuste os filtros ou cadastre uma nova assinatura."
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
