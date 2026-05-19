import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAddressesListPageViewModel } from '@features/client/addresses/hooks/useAddressesListPageViewModel';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const AddressesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const model = useAddressesListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Endereços"
        subtitle="Gerencie endereços vinculados a pessoas, alunos e responsáveis."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('client:address:create')}
        onAction={() => void navigate('/client/addresses/new')}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Endereço',
            mobileOrder: 1,
          },
          { type: 'text', name: 'city', label: 'Cidade', placeholder: 'Cidade', mobileOrder: 2 },
          { type: 'text', name: 'state', label: 'Estado', placeholder: 'UF', mobileOrder: 3 },
          {
            type: 'text',
            name: 'personId',
            label: 'Pessoa',
            placeholder: 'ID da pessoa',
            mobileOrder: 4,
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
        emptyTitle="Nenhum endereço encontrado"
        emptyDescription="Cadastre endereços para complementar os dados das pessoas."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros estruturados para cidade, UF e pessoa.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default AddressesPage;
