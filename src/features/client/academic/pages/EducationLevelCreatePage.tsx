import { AcademicCatalogFormPage } from '@features/client/academic/components/AcademicCatalogFormPage';
import { educationLevelService } from '@features/client/academic/services/academicServices';

const EducationLevelCreatePage = () => (
  <AcademicCatalogFormPage
    title="Novo nível de ensino"
    editTitle="Editar nível de ensino"
    subtitle="Cadastre a estrutura usada por séries, turmas e matrículas."
    backPath="/client/education-levels"
    service={educationLevelService}
    loadErrorMessage="Não foi possível carregar o nível de ensino."
    submitErrorMessage="Não foi possível salvar o nível de ensino."
  />
);

export default EducationLevelCreatePage;
