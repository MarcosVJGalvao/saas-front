import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSchoolClassesListPageViewModel } from '@features/client/academic/hooks/useSchoolClassesListPageViewModel';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const SchoolClassesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const model = useSchoolClassesListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Turmas"
        subtitle="Gerencie turmas, capacidade, turno, alunos e professores vinculados."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('client:school-class:create')}
        onAction={() => void navigate('/client/school-classes/new')}
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
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.list.loading}
      />
      <QueryDataTable
        rows={model.list.rows}
        columns={model.columns}
        mobileConfig={model.mobileConfig}
        meta={model.list.meta}
        loading={model.list.loading}
        errorMessage={model.list.errorMessage}
        onRetry={() => {
          void model.list.reload();
        }}
        query={model.query}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onLimitChange}
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
