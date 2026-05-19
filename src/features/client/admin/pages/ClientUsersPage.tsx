import { AdminEntitiesListPage } from '@features/client/admin/components/AdminEntitiesListPage';
import { clientUsersService } from '@features/client/admin/services/adminServices';

const ClientUsersPage = () => (
  <AdminEntitiesListPage
    title="Usuários"
    subtitle="Gerencie usuários do tenant e vínculo com colaboradores."
    routeBase="/client/users"
    service={clientUsersService}
    errorMessageFallback="Não foi possível carregar usuários."
    emptyTitle="Nenhum usuário encontrado"
    emptyDescription="Usuários cadastrados aparecerão nesta consulta."
    createPermission="client:users:create"
    showRole
  />
);

export default ClientUsersPage;
