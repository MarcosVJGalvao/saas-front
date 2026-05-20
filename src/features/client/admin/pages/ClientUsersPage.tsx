import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useClientUsersListPage } from '@features/client/admin/hooks/useClientUsersListPage';

const ClientUsersPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const clientUsersPage = useClientUsersListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Usuários"
        subtitle="Gerencie usuários do tenant e vínculo com colaboradores."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('users:create')}
        onAction={() => {
          void navigate('/client/users/new');
        }}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Nome ou e-mail',
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
        values={clientUsersPage.filterValues}
        onChange={clientUsersPage.onFilterChange}
        onApply={clientUsersPage.applyFilters}
        onClear={clientUsersPage.clearFilters}
        loading={clientUsersPage.adminEntityList.loading}
      />
      <QueryDataTable
        rows={clientUsersPage.adminEntityList.rows}
        columns={clientUsersPage.tableColumns}
        mobileConfig={clientUsersPage.mobileConfig}
        meta={clientUsersPage.adminEntityList.meta}
        loading={clientUsersPage.adminEntityList.loading}
        errorMessage={clientUsersPage.adminEntityList.errorMessage}
        onRetry={() => {
          void clientUsersPage.adminEntityList.reload();
        }}
        query={clientUsersPage.adminEntityList.query.search ?? ''}
        onQueryChange={(search) => clientUsersPage.adminEntityList.updateQuery({ search, page: 1 })}
        onPageChange={(page) => clientUsersPage.adminEntityList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          clientUsersPage.adminEntityList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhum usuário encontrado"
        emptyDescription="Usuários cadastrados aparecerão nesta consulta."
        toolbarContent={
          <AppText color="text.secondary">Use a busca geral para localizar registros.</AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default ClientUsersPage;
