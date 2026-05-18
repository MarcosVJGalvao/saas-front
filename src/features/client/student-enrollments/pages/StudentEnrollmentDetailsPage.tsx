import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useStudentEnrollmentDetailsPageViewModel } from '@features/client/student-enrollments/hooks/useStudentEnrollmentDetailsPageViewModel';

const detailsContent = {
  pageTitle: 'Detalhes da Matrícula',
  pageSubtitle: 'Visualize os dados principais da matrícula.',
  loadingLabel: 'Carregando detalhes da matrícula',
  emptyTitle: 'Matrícula não encontrada',
  emptyMessage: 'Não foi possível localizar a matrícula selecionada.',
  errorFallback: 'Erro ao carregar matrícula.',
  unauthorizedTitle: 'Sessão expirada',
  unauthorizedMessage: 'Entre novamente para visualizar esta matrícula.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não tem permissão para visualizar esta matrícula.',
};

const StudentEnrollmentDetailsPage = () => {
  const model = useStudentEnrollmentDetailsPageViewModel();

  return (
    <>
      <EntityDetailsPage
        viewState={model.viewState}
        content={detailsContent}
        data={model.data}
        errorMessage={model.errorMessage}
        onBack={model.onBack}
        onRetry={() => {
          void model.onRetry();
        }}
      />
      <ConfirmDialog
        open={model.deleteDialogOpen}
        title={model.deleteTitle}
        description={model.deleteDescription}
        confirmLabel={model.actionLoading ? 'Removendo...' : 'Remover'}
        onCancel={model.closeDeleteDialog}
        onConfirm={() => {
          void model.confirmDelete();
        }}
      />
    </>
  );
};

export default StudentEnrollmentDetailsPage;
