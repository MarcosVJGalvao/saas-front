import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useClientUserDetailsPage } from '@features/client/admin/hooks/useClientUserDetailsPage';

const ClientUserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const clientUserDetailsPage = useClientUserDetailsPage(id ?? '');

  return (
    <EntityDetailsPage
      viewState={clientUserDetailsPage.viewState}
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
      data={clientUserDetailsPage.data}
      errorMessage={clientUserDetailsPage.errorMessage}
      onBack={clientUserDetailsPage.onBack}
      onRetry={() => {
        void clientUserDetailsPage.onRetry();
      }}
    />
  );
};

export default ClientUserDetailsPage;
