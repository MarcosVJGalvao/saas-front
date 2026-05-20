import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { AppStack } from '@shared/components/layout/AppStack';
import { useParams } from 'react-router-dom';
import { useStudentEnrollmentDetailsPage } from '@features/client/student-enrollments/hooks/useStudentEnrollmentDetailsPage';

const StudentEnrollmentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const studentEnrollmentDetailsPage = useStudentEnrollmentDetailsPage(id ?? '');

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes da Matrícula"
        subtitle="Visualize os dados principais da matrícula."
        actionLabel="Voltar"
        onAction={() => {
          studentEnrollmentDetailsPage.onBack();
        }}
      />
      <EntityDetailsPage
        viewState={studentEnrollmentDetailsPage.viewState}
        data={studentEnrollmentDetailsPage.data}
        errorMessage={studentEnrollmentDetailsPage.errorMessage}
        onRetry={() => {
          void studentEnrollmentDetailsPage.onRetry();
        }}
      />
      <ConfirmDialog
        open={Boolean(studentEnrollmentDetailsPage.deleteModal.enrollmentPendingDelete)}
        title="Remover matrícula"
        description={`Confirma a remoção da matrícula ${studentEnrollmentDetailsPage.deleteModal.enrollmentPendingDelete?.enrollmentCode ?? 'selecionada'}?`}
        confirmLabel={
          studentEnrollmentDetailsPage.deleteModal.isDeleting ? 'Removendo...' : 'Remover'
        }
        onCancel={studentEnrollmentDetailsPage.deleteModal.close}
        onConfirm={() => {
          void studentEnrollmentDetailsPage.deleteModal.confirm();
        }}
      />
    </AppStack>
  );
};

export default StudentEnrollmentDetailsPage;
