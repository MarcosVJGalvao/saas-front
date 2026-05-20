import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { usePlansListPage } from '@features/platform/plans/hooks/usePlansListPage';

const PlansListPage = () => {
  const plansPage = usePlansListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Planos"
        subtitle="Gerencie planos, preços, trials e ciclos de cobrança da plataforma."
        actionLabel="Novo plano"
        onAction={plansPage.onCreate}
      />
      {plansPage.actionErrorMessage ? (
        <AppAlert severity="error">{plansPage.actionErrorMessage}</AppAlert>
      ) : null}
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'search',
            label: 'Buscar',
            placeholder: 'Buscar plano...',
            mobileOrder: 1,
          },
        ]}
        values={{ search: plansPage.plansList.queryParams.search ?? '' }}
        onChange={(filterKey, filterValue) => {
          if (filterKey === 'search') {
            plansPage.plansList.updateQueryParams({
              search: typeof filterValue === 'string' ? filterValue : undefined,
            });
          }
        }}
        onApply={() => undefined}
        onClear={() => {
          plansPage.plansList.updateQueryParams({ search: undefined });
        }}
        loading={plansPage.plansList.loading || plansPage.deleteModal.loading}
      />
      <QueryDataTable
        rows={plansPage.plansList.rows}
        columns={plansPage.tableColumns}
        mobileConfig={plansPage.mobileConfig}
        meta={plansPage.plansList.pagination}
        query={plansPage.plansList.queryParams.search ?? ''}
        onQueryChange={(search) => {
          plansPage.plansList.updateQueryParams({ search });
        }}
        loading={plansPage.plansList.loading}
        errorMessage={plansPage.plansList.errorMessage}
        onRetry={() => {
          void plansPage.plansList.reload();
        }}
        onPageChange={(page) => {
          plansPage.plansList.updateQueryParams({ page });
        }}
        onRowsPerPageChange={(limit) => {
          plansPage.plansList.updateQueryParams({ limit, page: 1 });
        }}
        hideToolbar
        emptyTitle="Nenhum plano encontrado"
        emptyDescription="Cadastre planos para disponibilizar novas assinaturas."
      />
      <ConfirmDialog
        open={Boolean(plansPage.deleteModal.planPendingDelete)}
        title="Excluir plano"
        description={`Deseja excluir o plano "${plansPage.deleteModal.planPendingDelete?.name ?? ''}"?`}
        confirmLabel="Excluir"
        onCancel={plansPage.deleteModal.close}
        onConfirm={() => {
          void plansPage.deleteModal.confirm();
        }}
      />
    </AppStack>
  );
};

export default PlansListPage;
