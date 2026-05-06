import Button from '@mui/material/Button';
import { ListFilters } from '../../../components/common/data/ListFilters';
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

      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Buscar plano...',
            mobileOrder: 1,
          },
        ]}
        values={{ query: model.query }}
        onChange={(name, value) => {
          if (name === 'query') model.onQueryChange(String(value));
        }}
        onApply={() => undefined}
        onClear={() => model.onQueryChange('')}
        loading={model.view.list.loading}
      />

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
