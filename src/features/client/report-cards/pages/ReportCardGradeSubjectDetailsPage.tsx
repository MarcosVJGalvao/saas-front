import { ReportCardCatalogDetailsPage } from '@features/client/report-cards/components/ReportCardCatalogDetailsPage';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';

const gradeSubjectDetailsService = {
  getById: (id: string) => reportCardService.getGradeSubjectById(id),
};

const ReportCardGradeSubjectDetailsPage = () => (
  <ReportCardCatalogDetailsPage
    mode="gradeSubjects"
    service={gradeSubjectDetailsService}
    backPath="/client/report-cards/grade-subjects"
    fallbackSubtitle="Matriz curricular"
    content={{
      pageTitle: 'Detalhes da matriz curricular',
      pageSubtitle: 'Consulte disciplina, série, ano letivo e carga horária da matriz.',
      loadingLabel: 'Carregando matriz curricular...',
      emptyTitle: 'Vínculo não encontrado',
      emptyMessage: 'Não encontramos dados para este vínculo da matriz curricular.',
      errorFallback: 'Não foi possível carregar detalhes da matriz curricular.',
      unauthorizedTitle: 'Acesso não autenticado',
      unauthorizedMessage: 'Entre novamente para consultar matriz curricular.',
      forbiddenTitle: 'Acesso sem permissão',
      forbiddenMessage: 'Seu perfil não possui permissão para consultar matriz curricular.',
    }}
  />
);

export default ReportCardGradeSubjectDetailsPage;
