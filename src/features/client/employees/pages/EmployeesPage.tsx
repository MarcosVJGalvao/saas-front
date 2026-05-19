import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useEmployeesListPageViewModel } from '@features/client/employees/hooks/useEmployeesListPageViewModel';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const EmployeesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const model = useEmployeesListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Funcionários"
        subtitle="Gerencie funcionários, cargos e vínculos pessoais."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('employees:create')}
        onAction={() => void navigate('/client/employees/new')}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Nome ou documento',
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'status',
            label: 'Status',
            placeholder: 'active ou inactive',
            mobileOrder: 2,
          },
        ]}
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.loading}
      />
      <QueryDataTable
        rows={model.rows}
        columns={model.columns}
        mobileConfig={model.mobileConfig}
        meta={model.meta}
        loading={model.loading}
        errorMessage={model.errorMessage}
        onRetry={() => {
          void model.reload();
        }}
        query={model.query.search ?? ''}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onLimitChange}
        emptyTitle="Nenhum funcionário encontrado"
        emptyDescription="Cadastre funcionários para vincular horários, disciplinas e rotinas acadêmicas."
        toolbarContent={
          <AppText color="text.secondary">
            Nome e documento são enviados apenas pelo parâmetro search.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default EmployeesPage;
