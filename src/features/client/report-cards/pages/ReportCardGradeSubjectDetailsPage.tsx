import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useReportCardGradeSubjectDetailsPage } from '@features/client/report-cards/hooks/useReportCardGradeSubjectDetailsPage';

const ReportCardGradeSubjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const reportCardGradeSubjectDetailsPage = useReportCardGradeSubjectDetailsPage(id ?? '');

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes da matriz curricular"
        subtitle="Consulte disciplina, série, ano letivo e carga horária da matriz."
        actionLabel="Voltar"
        onAction={reportCardGradeSubjectDetailsPage.onBack}
      />
      <EntityDetailsPage
        viewState={reportCardGradeSubjectDetailsPage.viewState}
        data={reportCardGradeSubjectDetailsPage.data}
        errorMessage={reportCardGradeSubjectDetailsPage.errorMessage}
        onRetry={() => {
          void reportCardGradeSubjectDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default ReportCardGradeSubjectDetailsPage;
