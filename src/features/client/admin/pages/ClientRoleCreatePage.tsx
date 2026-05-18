import { AdminEntityFormPage } from '@features/client/admin/components/AdminEntityFormPage';
import { clientRolesService } from '@features/client/admin/services/adminServices';

const ClientRoleCreatePage = () => (
  <AdminEntityFormPage
    title="Novo perfil"
    editTitle="Editar perfil"
    subtitle="Cadastre perfis de acesso para organizar permissões do tenant."
    backPath="/client/roles"
    service={clientRolesService}
    loadErrorMessage="Não foi possível carregar o perfil."
    submitErrorMessage="Não foi possível salvar o perfil."
  />
);

export default ClientRoleCreatePage;
