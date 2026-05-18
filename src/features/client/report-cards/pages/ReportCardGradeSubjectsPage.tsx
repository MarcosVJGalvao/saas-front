import { ReportCardCatalogListPage } from '@features/client/report-cards/components/ReportCardCatalogListPage';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';

const ReportCardGradeSubjectsPage = () => (
  <ReportCardCatalogListPage
    mode="gradeSubjects"
    title="Matriz curricular"
    subtitle="Configure disciplinas por série e ano letivo."
    routeBase="/client/report-cards/grade-subjects"
    service={(params) => reportCardService.listGradeSubjects(params)}
    errorMessageFallback="Não foi possível carregar matriz curricular."
    emptyTitle="Nenhum vínculo encontrado"
    emptyDescription="Disciplinas vinculadas por série aparecerão nesta consulta."
  />
);

export default ReportCardGradeSubjectsPage;
