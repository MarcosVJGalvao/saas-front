import { AcademicCatalogDetailsPage } from '@features/client/academic/components/AcademicCatalogDetailsPage';
import { gradeService } from '@features/client/academic/services/academicServices';

const GradeDetailsPage = () => (
  <AcademicCatalogDetailsPage
    service={gradeService}
    backPath="/client/grades"
    errorMessageFallback="Erro ao carregar série."
    content={{
      pageTitle: 'Detalhes da série',
      pageSubtitle: 'Consulte os dados da série e o nível de ensino vinculado.',
      loadingLabel: 'Carregando série...',
      emptyTitle: 'Série não encontrada',
      emptyMessage: 'Não encontramos a série solicitada.',
      errorFallback: 'Erro ao carregar série.',
      unauthorizedTitle: 'Acesso não autorizado',
      unauthorizedMessage: 'Faça login novamente para consultar esta série.',
      forbiddenTitle: 'Acesso negado',
      forbiddenMessage: 'Você não possui permissão para consultar esta série.',
    }}
  />
);

export default GradeDetailsPage;
