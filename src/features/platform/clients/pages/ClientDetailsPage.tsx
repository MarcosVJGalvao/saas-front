import { useParams } from 'react-router-dom';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useClientDetailsPage } from '@features/platform/clients/hooks/useClientDetailsPage';

const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const clientDetailsPage = useClientDetailsPage(id ?? '');

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes do cliente"
        subtitle="Consulte organização, plano, assinatura e dados de controle."
        actionLabel="Voltar"
        onAction={() => {
          clientDetailsPage.onBack();
        }}
      />
      <EntityDetailsPage
        viewState={clientDetailsPage.viewState}
        data={clientDetailsPage.data}
        errorMessage={clientDetailsPage.errorMessage}
        onRetry={() => {
          void clientDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default ClientDetailsPage;
