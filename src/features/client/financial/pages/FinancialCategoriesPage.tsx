import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useFinancialCategoriesListPage } from '@features/client/financial/hooks/useFinancialCategoriesListPage';

const FinancialCategoriesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const financialCategoriesPage = useFinancialCategoriesListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Categorias financeiras"
        subtitle="Organize receitas e despesas por categoria."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('finance:create')}
        onAction={() => {
          void navigate('/client/financial/categories/new');
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
          {
            type: 'select',
            name: 'type',
            label: 'Tipo',
            placeholder: 'Todos os tipos',
            options: [
              { value: 'revenue', label: 'Receita' },
              { value: 'expense', label: 'Despesa' },
            ],
            mobileOrder: 4,
          },
        ]}
        values={financialCategoriesPage.filterValues}
        onChange={financialCategoriesPage.onFilterChange}
        onApply={financialCategoriesPage.applyFilters}
        onClear={financialCategoriesPage.clearFilters}
        loading={financialCategoriesPage.financialEntityList.loading}
      />
      <QueryDataTable
        rows={financialCategoriesPage.financialEntityList.rows}
        columns={financialCategoriesPage.tableColumns}
        mobileConfig={financialCategoriesPage.mobileConfig}
        meta={financialCategoriesPage.financialEntityList.meta}
        loading={financialCategoriesPage.financialEntityList.loading}
        errorMessage={financialCategoriesPage.financialEntityList.errorMessage}
        onRetry={() => {
          void financialCategoriesPage.financialEntityList.reload();
        }}
        query={financialCategoriesPage.financialEntityList.query.search ?? ''}
        onQueryChange={(search) =>
          financialCategoriesPage.financialEntityList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => financialCategoriesPage.financialEntityList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          financialCategoriesPage.financialEntityList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhuma categoria encontrada"
        emptyDescription="Cadastre categorias para classificar movimentações financeiras."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para localizar registros por nome, código, status ou tipo.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default FinancialCategoriesPage;
