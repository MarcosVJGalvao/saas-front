import { useReportCardCatalogDetailsPage } from '@features/client/report-cards/hooks/useReportCardCatalogDetailsPage';
import { reportCardService } from '@features/client/report-cards/services/service';

export const useReportCardGradeSubjectDetailsPage = (id: string) =>
  useReportCardCatalogDetailsPage({
    id,
    mode: 'gradeSubjects',
    service: { getById: (entityId) => reportCardService.getGradeSubjectById(entityId) },
    backPath: '/client/report-cards/grade-subjects',
    errorMessageFallback: 'Não foi possível carregar detalhes da matriz curricular.',
  });
