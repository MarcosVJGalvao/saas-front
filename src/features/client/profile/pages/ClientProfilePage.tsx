import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppStack } from '@shared/components/layout/AppStack';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useClientProfilePage } from '@features/client/profile/hooks/useClientProfilePage';

const ClientProfilePage = () => {
  const clientProfilePage = useClientProfilePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Meu perfil"
        subtitle="Consulte seus dados de acesso, o tenant ativo e os privilégios desta sessão."
        actionLabel="Voltar"
        onAction={clientProfilePage.onBack}
      />
      <EntityDetailsPage
        viewState={clientProfilePage.viewState}
        data={clientProfilePage.data}
        errorMessage={clientProfilePage.errorMessage}
        onRetry={() => {
          void clientProfilePage.onRetry();
        }}
        content={{
          loadingLabel: 'Carregando perfil do cliente...',
          emptyTitle: 'Perfil indisponível',
          emptyMessage: 'Não encontramos dados do seu perfil neste cliente.',
          errorFallback: 'Não foi possível carregar seu perfil do cliente.',
          unauthorizedTitle: 'Sessão não autenticada',
          unauthorizedMessage: 'Entre novamente para consultar seu perfil.',
          forbiddenTitle: 'Acesso indisponível',
          forbiddenMessage: 'Seu acesso atual não permite consultar este perfil.',
        }}
      />
    </AppStack>
  );
};

export default ClientProfilePage;
