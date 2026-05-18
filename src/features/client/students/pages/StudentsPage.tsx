import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { useStudentsListPageViewModel } from '@features/client/students/hooks/useStudentsListPageViewModel';

const StudentsPage = () => {
  const model = useStudentsListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Alunos"
        subtitle="Gerencie cadastro, responsáveis, documentos e histórico financeiro dos alunos."
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
        emptyTitle="Nenhum aluno encontrado"
        emptyDescription="Os alunos cadastrados aparecerão aqui."
        toolbarContent={
          <AppText color="text.secondary">
            Use os filtros para localizar alunos por nome, documento, código ou status.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default StudentsPage;
