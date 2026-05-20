import { useReportCardCatalogDetailsPage } from '@features/client/report-cards/hooks/useReportCardCatalogDetailsPage';
import { reportCardService } from '@features/client/report-cards/services/service';

export const useReportCardAcademicPeriodDetailsPage = (id: string) =>
  useReportCardCatalogDetailsPage({
    id,
    mode: 'periods',
    service: { getById: (entityId) => reportCardService.getAcademicPeriodById(entityId) },
    backPath: '/client/report-cards/academic-periods',
    errorMessageFallback: 'Não foi possível carregar detalhes do período do boletim.',
  });
