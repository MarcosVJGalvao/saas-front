import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useReportCardAcademicPeriodDetailsPage } from '@features/client/report-cards/hooks/useReportCardAcademicPeriodDetailsPage';

const ReportCardAcademicPeriodDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const reportCardAcademicPeriodDetailsPage = useReportCardAcademicPeriodDetailsPage(id ?? '');

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes do período"
        subtitle="Consulte vigência, ano letivo e status do período do boletim."
        actionLabel="Voltar"
        onAction={reportCardAcademicPeriodDetailsPage.onBack}
      />
      <EntityDetailsPage
        viewState={reportCardAcademicPeriodDetailsPage.viewState}
        data={reportCardAcademicPeriodDetailsPage.data}
        errorMessage={reportCardAcademicPeriodDetailsPage.errorMessage}
        onRetry={() => {
          void reportCardAcademicPeriodDetailsPage.onRetry();
        }}
      />
    </AppStack>
  );
};

export default ReportCardAcademicPeriodDetailsPage;
