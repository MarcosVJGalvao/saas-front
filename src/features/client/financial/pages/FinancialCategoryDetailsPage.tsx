import { FinancialEntityDetailsPage } from '@features/client/financial/components/FinancialEntityDetailsPage';
import { financialCategoryService } from '@features/client/financial/services/financialServices';

const FinancialCategoryDetailsPage = () => (
  <FinancialEntityDetailsPage
    service={financialCategoryService}
    backPath="/client/financial/categories"
    fallbackSubtitle="Categoria financeira"
    errorMessageFallback="Não foi possível carregar detalhes da categoria financeira."
    includeType
    content={{
      pageTitle: 'Detalhes da categoria',
      pageSubtitle: 'Consulte dados cadastrais, tipo e status da categoria financeira.',
      loadingLabel: 'Carregando categoria financeira...',
      emptyTitle: 'Categoria não encontrada',
      emptyMessage: 'Não encontramos dados para esta categoria financeira.',
      errorFallback: 'Não foi possível carregar detalhes da categoria financeira.',
      unauthorizedTitle: 'Acesso não autenticado',
      unauthorizedMessage: 'Entre novamente para consultar categorias financeiras.',
      forbiddenTitle: 'Acesso sem permissão',
      forbiddenMessage: 'Seu perfil não possui permissão para consultar categorias financeiras.',
    }}
  />
);

export default FinancialCategoryDetailsPage;
