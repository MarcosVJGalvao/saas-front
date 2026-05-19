import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useMedicalInfoListPageViewModel } from '@features/client/medical-info/hooks/useMedicalInfoListPageViewModel';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const MedicalInfoPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const model = useMedicalInfoListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Informações médicas"
        subtitle="Gerencie registros médicos e contatos de emergência."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('medical-info:create')}
        onAction={() => void navigate('/client/medical-info/new')}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Pessoa, contato ou observação',
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
        emptyTitle="Nenhum registro médico encontrado"
        emptyDescription="Cadastre informações médicas para apoiar atendimentos e emergências."
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

export default MedicalInfoPage;
