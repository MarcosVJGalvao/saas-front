import { useReportCardCatalogListPage } from '@features/client/report-cards/hooks/useReportCardCatalogListPage';
import { reportCardService } from '@features/client/report-cards/services/service';

export const useReportCardAcademicPeriodsPage = () =>
  useReportCardCatalogListPage({
    mode: 'periods',
    routeBase: '/client/report-cards/academic-periods',
    service: (params) => reportCardService.listAcademicPeriods(params),
    errorMessageFallback: 'Não foi possível carregar períodos do boletim.',
  });
