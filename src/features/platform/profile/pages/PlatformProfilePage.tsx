import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppStack } from '@shared/components/layout/AppStack';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { usePlatformProfilePage } from '@features/platform/profile/hooks/usePlatformProfilePage';

const PlatformProfilePage = () => {
  const platformProfilePage = usePlatformProfilePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Meu perfil"
        subtitle="Consulte seus dados de acesso à plataforma e os privilégios ativos nesta sessão."
        actionLabel="Voltar"
        onAction={platformProfilePage.onBack}
      />
      <EntityDetailsPage
        viewState={platformProfilePage.viewState}
        data={platformProfilePage.data}
        errorMessage={platformProfilePage.errorMessage}
        onRetry={() => {
          void platformProfilePage.onRetry();
        }}
        content={{
          loadingLabel: 'Carregando perfil da plataforma...',
          emptyTitle: 'Perfil indisponível',
          emptyMessage: 'Não encontramos dados do seu perfil de plataforma.',
          errorFallback: 'Não foi possível carregar seu perfil de plataforma.',
          unauthorizedTitle: 'Sessão não autenticada',
          unauthorizedMessage: 'Entre novamente para consultar seu perfil.',
          forbiddenTitle: 'Acesso indisponível',
          forbiddenMessage: 'Seu acesso atual não permite consultar este perfil.',
        }}
      />
    </AppStack>
  );
};

export default PlatformProfilePage;
