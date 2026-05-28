import { AppBox } from '@shared/components/layout/AppBox';
import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useFinancialCostCentersListPage } from '@features/client/financial/hooks/useFinancialCostCentersListPage';

const FinancialCostCentersListTab = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const listPage = useFinancialCostCentersListPage();

  return (
    <AppStack spacing={2}>
      {permissions.can('finance:create') ? (
        <AppBox sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AppButton
            variant="contained"
            onClick={() => {
              void navigate('/client/financial/cost-centers/new');
            }}
          >
            Cadastrar
          </AppButton>
        </AppBox>
      ) : null}
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
        values={listPage.filterValues}
        onChange={listPage.onFilterChange}
        onApply={listPage.applyFilters}
        onClear={listPage.clearFilters}
        loading={listPage.financialEntityList.loading}
      />
      <QueryDataTable
        rows={listPage.financialEntityList.rows}
        columns={listPage.tableColumns}
        mobileConfig={listPage.mobileConfig}
        meta={listPage.financialEntityList.meta}
        loading={listPage.financialEntityList.loading}
        errorMessage={listPage.financialEntityList.errorMessage}
        onRetry={() => {
          void listPage.financialEntityList.reload();
        }}
        query={listPage.financialEntityList.query.search ?? ''}
        onQueryChange={(search) => listPage.financialEntityList.updateQuery({ search, page: 1 })}
        onPageChange={(page) => listPage.financialEntityList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          listPage.financialEntityList.updateQuery({ limit, page: 1 })
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

export default FinancialCostCentersListTab;
