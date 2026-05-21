import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSchoolClassesListPage } from '@features/client/academic/hooks/useSchoolClassesListPage';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const SchoolClassesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const schoolClassesPage = useSchoolClassesListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Turmas"
        subtitle="Gerencie turmas, capacidade, turno, alunos e professores vinculados."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('school-class:create')}
        onAction={() => {
          void navigate('/client/school-classes/new');
        }}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Nome da turma',
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'code',
            label: 'Código',
            placeholder: 'Código da turma',
            mobileOrder: 2,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              { value: 'active', label: 'Ativa' },
              { value: 'inactive', label: 'Inativa' },
              { value: 'cancelled', label: 'Cancelada' },
            ],
            mobileOrder: 3,
          },
          {
            type: 'select',
            name: 'shift',
            label: 'Turno',
            placeholder: 'Todos os turnos',
            options: [
              { value: '', label: 'Todos os turnos' },
              { value: 'morning', label: 'Manhã' },
              { value: 'afternoon', label: 'Tarde' },
              { value: 'evening', label: 'Noite' },
              { value: 'full_time', label: 'Integral' },
            ],
            mobileOrder: 4,
          },
        ]}
        values={schoolClassesPage.filterValues}
        onChange={schoolClassesPage.onFilterChange}
        onApply={schoolClassesPage.applyFilters}
        onClear={schoolClassesPage.clearFilters}
        loading={schoolClassesPage.schoolClassesList.loading}
      />
      <QueryDataTable
        rows={schoolClassesPage.schoolClassesList.rows}
        columns={schoolClassesPage.tableColumns}
        mobileConfig={schoolClassesPage.mobileConfig}
        meta={schoolClassesPage.schoolClassesList.meta}
        loading={schoolClassesPage.schoolClassesList.loading}
        errorMessage={schoolClassesPage.schoolClassesList.errorMessage}
        onRetry={() => {
          void schoolClassesPage.schoolClassesList.reload();
        }}
        query={schoolClassesPage.schoolClassesList.query.search ?? ''}
        onQueryChange={(search) =>
          schoolClassesPage.schoolClassesList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => schoolClassesPage.schoolClassesList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          schoolClassesPage.schoolClassesList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhuma turma encontrada"
        emptyDescription="Cadastre turmas para organizar alunos, horários e professores."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para localizar turmas por nome, código, status ou turno.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default SchoolClassesPage;
