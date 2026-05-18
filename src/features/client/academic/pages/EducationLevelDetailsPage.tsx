import { AcademicCatalogDetailsPage } from '@features/client/academic/components/AcademicCatalogDetailsPage';
import { educationLevelService } from '@features/client/academic/services/academicServices';

const EducationLevelDetailsPage = () => (
  <AcademicCatalogDetailsPage
    service={educationLevelService}
    backPath="/client/education-levels"
    errorMessageFallback="Erro ao carregar nível de ensino."
    content={{
      pageTitle: 'Detalhes do nível de ensino',
      pageSubtitle: 'Consulte os dados do nível usado por séries, turmas e matrículas.',
      loadingLabel: 'Carregando nível de ensino...',
      emptyTitle: 'Nível de ensino não encontrado',
      emptyMessage: 'Não encontramos o nível de ensino solicitado.',
      errorFallback: 'Erro ao carregar nível de ensino.',
      unauthorizedTitle: 'Acesso não autorizado',
      unauthorizedMessage: 'Faça login novamente para consultar este nível de ensino.',
      forbiddenTitle: 'Acesso negado',
      forbiddenMessage: 'Você não possui permissão para consultar este nível de ensino.',
    }}
  />
);

export default EducationLevelDetailsPage;
