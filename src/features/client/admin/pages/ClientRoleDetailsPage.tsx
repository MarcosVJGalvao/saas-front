import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useClientRoleDetailsPage } from '@features/client/admin/hooks/useClientRoleDetailsPage';

const ClientRoleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const clientRoleDetailsPage = useClientRoleDetailsPage(id ?? '');

  return (
    <EntityDetailsPage
      viewState={clientRoleDetailsPage.viewState}
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
      data={clientRoleDetailsPage.data}
      errorMessage={clientRoleDetailsPage.errorMessage}
      onBack={clientRoleDetailsPage.onBack}
      onRetry={() => {
        void clientRoleDetailsPage.onRetry();
      }}
    />
  );
};

export default ClientRoleDetailsPage;
