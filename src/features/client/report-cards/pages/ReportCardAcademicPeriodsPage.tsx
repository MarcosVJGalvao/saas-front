import { ReportCardCatalogListPage } from '@features/client/report-cards/components/ReportCardCatalogListPage';
import { reportCardService } from '@features/client/report-cards/services/reportCardServices';

const ReportCardAcademicPeriodsPage = () => (
  <ReportCardCatalogListPage
    mode="periods"
    title="Períodos do boletim"
    subtitle="Configure períodos acadêmicos usados no fechamento de boletins."
    routeBase="/client/report-cards/academic-periods"
    service={(params) => reportCardService.listAcademicPeriods(params)}
    createService={(payload) => reportCardService.createAcademicPeriod(payload)}
    errorMessageFallback="Não foi possível carregar períodos do boletim."
    emptyTitle="Nenhum período encontrado"
    emptyDescription="Períodos acadêmicos aparecerão nesta consulta."
  />
);

export default ReportCardAcademicPeriodsPage;
