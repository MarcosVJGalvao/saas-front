import { AcademicCatalogFormPage } from '@features/client/academic/components/AcademicCatalogFormPage';
import { subjectService } from '@features/client/academic/services/academicServices';

const SubjectCreatePage = () => (
  <AcademicCatalogFormPage
    title="Nova disciplina"
    editTitle="Editar disciplina"
    subtitle="Cadastre disciplinas usadas em turmas, frequência e boletins."
    backPath="/client/subjects"
    service={subjectService}
    loadErrorMessage="Não foi possível carregar a disciplina."
    submitErrorMessage="Não foi possível salvar a disciplina."
  />
);

export default SubjectCreatePage;
