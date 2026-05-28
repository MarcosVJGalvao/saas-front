import { AppBox } from '@shared/components/layout/AppBox';
import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useClientUsersListPage } from '@features/client/admin/hooks/useClientUsersListPage';

const UsersListTab = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const listPage = useClientUsersListPage();

  return (
    <AppStack spacing={2}>
      {permissions.can('users:create') ? (
        <AppBox sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AppButton
            variant="contained"
            onClick={() => {
              void navigate('/client/users/new');
            }}
          >
            Cadastrar
          </AppButton>
        </AppBox>
      ) : null}
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
        values={listPage.filterValues}
        onChange={listPage.onFilterChange}
        onApply={listPage.applyFilters}
        onClear={listPage.clearFilters}
        loading={listPage.adminEntityList.loading}
      />
      <QueryDataTable
        rows={listPage.adminEntityList.rows}
        columns={listPage.tableColumns}
        mobileConfig={listPage.mobileConfig}
        meta={listPage.adminEntityList.meta}
        loading={listPage.adminEntityList.loading}
        errorMessage={listPage.adminEntityList.errorMessage}
        onRetry={() => {
          void listPage.adminEntityList.reload();
        }}
        query={listPage.adminEntityList.query.search ?? ''}
        onQueryChange={(search) => listPage.adminEntityList.updateQuery({ search, page: 1 })}
        onPageChange={(page) => listPage.adminEntityList.updateQuery({ page })}
        onRowsPerPageChange={(limit) => listPage.adminEntityList.updateQuery({ limit, page: 1 })}
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

export default UsersListTab;
