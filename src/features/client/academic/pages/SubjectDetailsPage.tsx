import { AcademicCatalogDetailsPage } from '@features/client/academic/components/AcademicCatalogDetailsPage';
import { subjectService } from '@features/client/academic/services/academicServices';

const SubjectDetailsPage = () => (
  <AcademicCatalogDetailsPage
    service={subjectService}
    backPath="/client/subjects"
    errorMessageFallback="Erro ao carregar disciplina."
    content={{
      pageTitle: 'Detalhes da disciplina',
      pageSubtitle: 'Consulte os dados da disciplina usada em turmas e boletins.',
      loadingLabel: 'Carregando disciplina...',
      emptyTitle: 'Disciplina não encontrada',
      emptyMessage: 'Não encontramos a disciplina solicitada.',
      errorFallback: 'Erro ao carregar disciplina.',
      unauthorizedTitle: 'Acesso não autorizado',
      unauthorizedMessage: 'Faça login novamente para consultar esta disciplina.',
      forbiddenTitle: 'Acesso negado',
      forbiddenMessage: 'Você não possui permissão para consultar esta disciplina.',
    }}
  />
);

export default SubjectDetailsPage;
