import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { useLegalGuardiansListPageViewModel } from '@features/client/students/hooks/useLegalGuardiansListPageViewModel';

const LegalGuardiansPage = () => {
  const model = useLegalGuardiansListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Responsáveis"
        subtitle="Gerencie responsáveis legais e vínculos com alunos."
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
            type: 'select',
            name: 'relationshipType',
            label: 'Vínculo',
            placeholder: 'Todos os vínculos',
            options: [
              { value: '', label: 'Todos os vínculos' },
              { value: 'mother', label: 'Mãe' },
              { value: 'father', label: 'Pai' },
              { value: 'legal_guardian', label: 'Responsável legal' },
              { value: 'grandparent', label: 'Avô/avó' },
              { value: 'other', label: 'Outro' },
            ],
            mobileOrder: 2,
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
        emptyTitle="Nenhum responsável encontrado"
        emptyDescription="Responsáveis vinculados aos alunos aparecerão aqui."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para localizar responsáveis por busca geral ou vínculo.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default LegalGuardiansPage;
