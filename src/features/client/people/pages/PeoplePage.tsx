import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { usePeopleListPageViewModel } from '@features/client/people/hooks/usePeopleListPageViewModel';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const PeoplePage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const model = usePeopleListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Pessoas"
        subtitle="Gerencie cadastros pessoais usados por alunos, responsáveis e usuários."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('person:create')}
        onAction={() => void navigate('/client/people/new')}
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
        emptyTitle="Nenhuma pessoa encontrada"
        emptyDescription="Cadastre pessoas para reutilizar dados pessoais nos demais módulos."
        toolbarContent={
          <AppText color="text.secondary">
            A busca textual é enviada apenas pelo parâmetro search.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default PeoplePage;
