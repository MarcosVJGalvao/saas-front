import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useFinancialCostCentersListPage } from '@features/client/financial/hooks/useFinancialCostCentersListPage';

const FinancialCostCentersPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const financialCostCentersPage = useFinancialCostCentersListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Centros de custo"
        subtitle="Organize lançamentos financeiros por centro de custo."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('finance:create')}
        onAction={() => {
          void navigate('/client/financial/cost-centers/new');
        }}
      />
      <ListFilters
        fields={[
          { type: 'text', name: 'query', label: 'Buscar', placeholder: 'Nome', mobileOrder: 1 },
          { type: 'text', name: 'code', label: 'Código', placeholder: 'Código', mobileOrder: 2 },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
            ],
            mobileOrder: 3,
          },
        ]}
        values={financialCostCentersPage.filterValues}
        onChange={financialCostCentersPage.onFilterChange}
        onApply={financialCostCentersPage.applyFilters}
        onClear={financialCostCentersPage.clearFilters}
        loading={financialCostCentersPage.financialEntityList.loading}
      />
      <QueryDataTable
        rows={financialCostCentersPage.financialEntityList.rows}
        columns={financialCostCentersPage.tableColumns}
        mobileConfig={financialCostCentersPage.mobileConfig}
        meta={financialCostCentersPage.financialEntityList.meta}
        loading={financialCostCentersPage.financialEntityList.loading}
        errorMessage={financialCostCentersPage.financialEntityList.errorMessage}
        onRetry={() => {
          void financialCostCentersPage.financialEntityList.reload();
        }}
        query={financialCostCentersPage.financialEntityList.query.search ?? ''}
        onQueryChange={(search) =>
          financialCostCentersPage.financialEntityList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => financialCostCentersPage.financialEntityList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          financialCostCentersPage.financialEntityList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhum centro de custo encontrado"
        emptyDescription="Cadastre centros de custo para organizar lançamentos financeiros."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para localizar registros por nome, código e status.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default FinancialCostCentersPage;
