import { AcademicCatalogListPage } from '@features/client/academic/components/AcademicCatalogListPage';
import { subjectService } from '@features/client/academic/services/academicServices';

const SubjectsPage = () => (
  <AcademicCatalogListPage
    title="Disciplinas"
    subtitle="Gerencie disciplinas usadas nas turmas e boletins."
    routeBase="/client/subjects"
    service={subjectService}
    errorMessageFallback="Erro ao carregar disciplinas."
    emptyTitle="Nenhuma disciplina encontrada"
    emptyDescription="Cadastre disciplinas para compor turmas e boletins."
  />
);

export default SubjectsPage;
