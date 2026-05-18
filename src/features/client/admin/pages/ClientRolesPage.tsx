import { AdminEntitiesListPage } from '@features/client/admin/components/AdminEntitiesListPage';
import { clientRolesService } from '@features/client/admin/services/adminServices';

const ClientRolesPage = () => (
  <AdminEntitiesListPage
    title="Perfis"
    subtitle="Gerencie perfis de acesso do tenant."
    routeBase="/client/roles"
    service={clientRolesService}
    errorMessageFallback="Não foi possível carregar perfis."
    emptyTitle="Nenhum perfil encontrado"
    emptyDescription="Perfis de acesso cadastrados aparecerão nesta consulta."
    showPermissions
  />
);

export default ClientRolesPage;
