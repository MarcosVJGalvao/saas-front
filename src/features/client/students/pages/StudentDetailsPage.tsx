import { useNavigate, useParams } from 'react-router-dom';
import { AppButton } from '@shared/components/inputs/AppButton';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useStudentDetailsPage } from '@features/client/students/hooks/useStudentDetailsPage';

const StudentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentDetailsPage = useStudentDetailsPage(id ?? '');

  if (!id) return null;

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={studentDetailsPage.entity?.person?.fullName ?? 'Detalhes do aluno'}
        subtitle="Consulte dados cadastrais, contatos, endereços e matrículas do aluno."
        actions={
          studentDetailsPage.entity ? (
            <AppButton
              variant="outlined"
              onClick={() => {
                void navigate(`/client/students/${studentDetailsPage.entity?.id}/edit`, {
                  state: { entity: studentDetailsPage.entity },
                });
              }}
            >
              Editar
            </AppButton>
          ) : undefined
        }
        actionLabel="Voltar"
        onAction={() => {
          void studentDetailsPage.onBack();
        }}
      />
      <EntityDetailsPage
        content={studentDetailsPage.content}
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
