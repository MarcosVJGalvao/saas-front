import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useFinancialCategoryDetailsPage } from '@features/client/financial/hooks/useFinancialCategoryDetailsPage';

const FinancialCategoryDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const financialCategoryDetailsPage = useFinancialCategoryDetailsPage(id ?? '');

  return (
    <EntityDetailsPage
      viewState={financialCategoryDetailsPage.viewState}
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
      data={financialCategoryDetailsPage.data}
      errorMessage={financialCategoryDetailsPage.errorMessage}
      onBack={financialCategoryDetailsPage.onBack}
      onRetry={() => {
        void financialCategoryDetailsPage.onRetry();
      }}
    />
  );
};

export default FinancialCategoryDetailsPage;
