import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useStudentDetailsPage } from '@features/client/students/hooks/useStudentDetailsPage';

const StudentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const studentDetailsPage = useStudentDetailsPage(id ?? '');

  if (!id) return null;

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes do aluno"
        subtitle="Consulte dados cadastrais, contatos, endereços e matrículas do aluno."
        actionLabel="Voltar"
        onAction={() => {
          void studentDetailsPage.onBack();
        }}
      />
      <EntityDetailsPage
        viewState={studentDetailsPage.viewState}
        data={studentDetailsPage.data}
        errorMessage={studentDetailsPage.errorMessage}
        onRetry={() => {
          void studentDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default StudentDetailsPage;
