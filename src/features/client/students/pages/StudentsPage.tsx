import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useStudentsListPage } from '@features/client/students/hooks/useStudentsListPage';

const StudentsPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const studentsListPage = useStudentsListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Alunos"
        subtitle="Gerencie cadastro, responsáveis, documentos e histórico financeiro dos alunos."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('student:create')}
        onAction={() => void navigate('/client/students/new')}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Nome do aluno',
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
              { value: 'cancelled', label: 'Cancelado' },
            ],
            mobileOrder: 4,
          },
        ]}
        values={studentsListPage.filterValues}
        onChange={studentsListPage.onFilterChange}
        onApply={studentsListPage.applyFilters}
        onClear={studentsListPage.clearFilters}
        loading={studentsListPage.studentsList.loading}
      />
      <QueryDataTable
        rows={studentsListPage.studentsList.rows}
        columns={studentsListPage.tableColumns}
        mobileConfig={studentsListPage.mobileConfig}
        meta={studentsListPage.studentsList.pagination}
        loading={studentsListPage.studentsList.loading}
        errorMessage={studentsListPage.studentsList.errorMessage}
        onRetry={() => {
          void studentsListPage.studentsList.reload();
        }}
        query={studentsListPage.studentsList.queryParams.search ?? ''}
        onQueryChange={studentsListPage.onQueryChange}
        onPageChange={studentsListPage.onPageChange}
        onRowsPerPageChange={studentsListPage.onRowsPerPageChange}
        emptyTitle="Nenhum aluno encontrado"
        emptyDescription="Os alunos cadastrados aparecerão aqui."
        toolbarContent={
          <AppText color="text.secondary">
            Use a busca geral para localizar alunos por nome, documento ou código de matrícula.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default StudentsPage;
