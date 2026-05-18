import { AcademicCatalogListPage } from '@features/client/academic/components/AcademicCatalogListPage';
import { gradeService } from '@features/client/academic/services/academicServices';

const GradesPage = () => (
  <AcademicCatalogListPage
    title="Séries"
    subtitle="Gerencie séries e anos escolares por nível de ensino."
    routeBase="/client/grades"
    service={gradeService}
    errorMessageFallback="Erro ao carregar séries."
    emptyTitle="Nenhuma série encontrada"
    emptyDescription="Cadastre séries para organizar turmas e matrículas."
    showEducationLevel
  />
);

export default GradesPage;
