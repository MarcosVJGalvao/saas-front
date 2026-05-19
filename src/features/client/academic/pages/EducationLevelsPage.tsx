import { AcademicCatalogListPage } from '@features/client/academic/components/AcademicCatalogListPage';
import { educationLevelService } from '@features/client/academic/services/academicServices';

const EducationLevelsPage = () => (
  <AcademicCatalogListPage
    title="Níveis de ensino"
    subtitle="Organize os níveis usados por séries, turmas e matrículas."
    routeBase="/client/education-levels"
    service={educationLevelService}
    errorMessageFallback="Erro ao carregar níveis de ensino."
    emptyTitle="Nenhum nível de ensino encontrado"
    emptyDescription="Cadastre níveis de ensino para organizar séries e turmas."
    createPermission="client:education-level:create"
  />
);

export default EducationLevelsPage;
