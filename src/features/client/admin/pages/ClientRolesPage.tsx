import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useClientRolesListPage } from '@features/client/admin/hooks/useClientRolesListPage';

const ClientRolesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const clientRolesPage = useClientRolesListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Perfis"
        subtitle="Gerencie perfis de acesso do tenant."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('roles:create')}
        onAction={() => {
          void navigate('/client/roles/new');
        }}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Nome do perfil',
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
            ],
            mobileOrder: 2,
          },
        ]}
        values={clientRolesPage.filterValues}
        onChange={clientRolesPage.onFilterChange}
        onApply={clientRolesPage.applyFilters}
        onClear={clientRolesPage.clearFilters}
        loading={clientRolesPage.adminEntityList.loading}
      />
      <QueryDataTable
        rows={clientRolesPage.adminEntityList.rows}
        columns={clientRolesPage.tableColumns}
        mobileConfig={clientRolesPage.mobileConfig}
        meta={clientRolesPage.adminEntityList.meta}
        loading={clientRolesPage.adminEntityList.loading}
        errorMessage={clientRolesPage.adminEntityList.errorMessage}
        onRetry={() => {
          void clientRolesPage.adminEntityList.reload();
        }}
        query={clientRolesPage.adminEntityList.query.search ?? ''}
        onQueryChange={(search) => clientRolesPage.adminEntityList.updateQuery({ search, page: 1 })}
        onPageChange={(page) => clientRolesPage.adminEntityList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          clientRolesPage.adminEntityList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhum perfil encontrado"
        emptyDescription="Perfis de acesso cadastrados aparecerão nesta consulta."
        toolbarContent={
          <AppText color="text.secondary">Use a busca geral para localizar registros.</AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default ClientRolesPage;
