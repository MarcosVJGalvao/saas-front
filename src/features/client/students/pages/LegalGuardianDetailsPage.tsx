import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useLegalGuardianDetailsPage } from '@features/client/students/hooks/useLegalGuardianDetailsPage';

const LegalGuardianDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const legalGuardianDetailsPage = useLegalGuardianDetailsPage(id ?? '');

  if (!id) return null;

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes do responsável"
        subtitle="Consulte dados pessoais, contatos, endereços e alunos vinculados."
        actionLabel="Voltar"
        onAction={() => {
          void legalGuardianDetailsPage.onBack();
        }}
      />
      <EntityDetailsPage
        viewState={legalGuardianDetailsPage.viewState}
        data={legalGuardianDetailsPage.data}
        errorMessage={legalGuardianDetailsPage.errorMessage}
        onRetry={() => {
          void legalGuardianDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default LegalGuardianDetailsPage;
