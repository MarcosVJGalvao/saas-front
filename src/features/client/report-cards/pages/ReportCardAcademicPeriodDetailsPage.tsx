import { ReportCardCatalogDetailsPage } from '@features/client/report-cards/components/ReportCardCatalogDetailsPage';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';

const academicPeriodDetailsService = {
  getById: (id: string) => reportCardService.getAcademicPeriodById(id),
};

const ReportCardAcademicPeriodDetailsPage = () => (
  <ReportCardCatalogDetailsPage
    mode="periods"
    service={academicPeriodDetailsService}
    backPath="/client/report-cards/academic-periods"
    fallbackSubtitle="Período do boletim"
    content={{
      pageTitle: 'Detalhes do período',
      pageSubtitle: 'Consulte vigência, ano letivo e status do período do boletim.',
      loadingLabel: 'Carregando período do boletim...',
      emptyTitle: 'Período não encontrado',
      emptyMessage: 'Não encontramos dados para este período do boletim.',
      errorFallback: 'Não foi possível carregar detalhes do período do boletim.',
      unauthorizedTitle: 'Acesso não autenticado',
      unauthorizedMessage: 'Entre novamente para consultar períodos do boletim.',
      forbiddenTitle: 'Acesso sem permissão',
      forbiddenMessage: 'Seu perfil não possui permissão para consultar períodos do boletim.',
    }}
  />
);

export default ReportCardAcademicPeriodDetailsPage;
