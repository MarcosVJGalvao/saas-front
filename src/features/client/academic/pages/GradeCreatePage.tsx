import { AcademicCatalogFormPage } from '@features/client/academic/components/AcademicCatalogFormPage';
import { gradeService } from '@features/client/academic/services/academicServices';

const GradeCreatePage = () => (
  <AcademicCatalogFormPage
    title="Nova série"
    editTitle="Editar série"
    subtitle="Cadastre séries e anos escolares vinculados aos níveis de ensino."
    backPath="/client/grades"
    service={gradeService}
    loadErrorMessage="Não foi possível carregar a série."
    submitErrorMessage="Não foi possível salvar a série."
    showEducationLevel
  />
);

export default GradeCreatePage;
