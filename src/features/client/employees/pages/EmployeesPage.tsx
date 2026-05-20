import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useEmployeesListPage } from '@features/client/employees/hooks/useEmployeesListPage';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const isEmployeeFilterKey = (value: string): value is 'search' | 'status' =>
  value === 'search' || value === 'status';

const EmployeesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const employeesPage = useEmployeesListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Funcionários"
        subtitle="Gerencie funcionários, cargos e vínculos pessoais."
        actions={
          permissions.can('employees:create') ? (
            <AppButton
              variant="contained"
              onClick={() => {
                void navigate('/client/employees/new');
              }}
            >
              Cadastrar
            </AppButton>
          ) : undefined
        }
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'search',
            label: 'Buscar',
            placeholder: 'Nome ou documento',
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
              { value: 'terminated', label: 'Desligado' },
            ],
            mobileOrder: 2,
          },
        ]}
        values={employeesPage.filterValues}
        onChange={(filterKey, filterValue) => {
          if (typeof filterValue === 'string' && isEmployeeFilterKey(filterKey)) {
            employeesPage.onFilterChange(filterKey, filterValue);
          }
        }}
        onApply={employeesPage.applyFilters}
        onClear={employeesPage.clearFilters}
        loading={employeesPage.employeesList.loading}
      />
      <QueryDataTable
        rows={employeesPage.employeesList.rows}
        columns={employeesPage.tableColumns}
        mobileConfig={employeesPage.mobileConfig}
        meta={employeesPage.employeesList.pagination}
        loading={employeesPage.employeesList.loading}
        errorMessage={employeesPage.employeesList.errorMessage}
        onRetry={() => {
          void employeesPage.employeesList.reload();
        }}
        query={employeesPage.employeesList.queryParams.search ?? ''}
        onQueryChange={(search) =>
          employeesPage.employeesList.updateQueryParams({ search, page: 1 })
        }
        onPageChange={(page) => employeesPage.employeesList.updateQueryParams({ page })}
        onRowsPerPageChange={(limit) =>
          employeesPage.employeesList.updateQueryParams({ limit, page: 1 })
        }
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
