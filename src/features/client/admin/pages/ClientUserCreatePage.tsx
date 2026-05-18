import { AdminEntityFormPage } from '@features/client/admin/components/AdminEntityFormPage';
import { clientUsersService } from '@features/client/admin/services/adminServices';

const ClientUserCreatePage = () => (
  <AdminEntityFormPage
    title="Novo usuário"
    editTitle="Editar usuário"
    subtitle="Cadastre usuários e vincule perfis de acesso do tenant."
    backPath="/client/users"
    service={clientUsersService}
    loadErrorMessage="Não foi possível carregar o usuário."
    submitErrorMessage="Não foi possível salvar o usuário."
    includeUserFields
  />
);

export default ClientUserCreatePage;
