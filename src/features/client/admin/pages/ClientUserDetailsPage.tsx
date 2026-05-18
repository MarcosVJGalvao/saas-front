import { AdminEntityDetailsPage } from '@features/client/admin/components/AdminEntityDetailsPage';
import { clientUsersService } from '@features/client/admin/services/adminServices';

const ClientUserDetailsPage = () => (
  <AdminEntityDetailsPage
    service={clientUsersService}
    backPath="/client/users"
    fallbackSubtitle="Usuário do tenant"
    showRole
    content={{
      pageTitle: 'Detalhes do usuário',
      pageSubtitle: 'Consulte dados de acesso, perfil e status do usuário.',
      loadingLabel: 'Carregando usuário...',
      emptyTitle: 'Usuário não encontrado',
      emptyMessage: 'Não encontramos dados para este usuário.',
      errorFallback: 'Não foi possível carregar detalhes do usuário.',
      unauthorizedTitle: 'Acesso não autenticado',
      unauthorizedMessage: 'Entre novamente para consultar usuários.',
      forbiddenTitle: 'Acesso sem permissão',
      forbiddenMessage: 'Seu perfil não possui permissão para consultar usuários.',
    }}
  />
);

export default ClientUserDetailsPage;
