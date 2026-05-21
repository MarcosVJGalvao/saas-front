import { useReportCardCatalogListPage } from '@features/client/report-cards/hooks/useReportCardCatalogListPage';
import { reportCardService } from '@features/client/report-cards/services/service';

export const useReportCardGradeSubjectsPage = () =>
  useReportCardCatalogListPage({
    mode: 'gradeSubjects',
    routeBase: '/client/report-cards/grade-subjects',
    service: (params) => reportCardService.listGradeSubjects(params),
    errorMessageFallback: 'Não foi possível carregar matriz curricular.',
  });
