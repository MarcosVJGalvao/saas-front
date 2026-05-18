import { AdminEntityDetailsPage } from '@features/client/admin/components/AdminEntityDetailsPage';
import { clientRolesService } from '@features/client/admin/services/adminServices';

const ClientRoleDetailsPage = () => (
  <AdminEntityDetailsPage
    service={clientRolesService}
    backPath="/client/roles"
    fallbackSubtitle="Perfil de acesso"
    showPermissions
    content={{
      pageTitle: 'Detalhes do perfil',
      pageSubtitle: 'Consulte dados cadastrais, permissões e status do perfil.',
      loadingLabel: 'Carregando perfil...',
      emptyTitle: 'Perfil não encontrado',
      emptyMessage: 'Não encontramos dados para este perfil.',
      errorFallback: 'Não foi possível carregar detalhes do perfil.',
      unauthorizedTitle: 'Acesso não autenticado',
      unauthorizedMessage: 'Entre novamente para consultar perfis.',
      forbiddenTitle: 'Acesso sem permissão',
      forbiddenMessage: 'Seu perfil não possui permissão para consultar perfis.',
    }}
  />
);

export default ClientRoleDetailsPage;
