import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useFinancialCostCenterDetailsPage } from '@features/client/financial/hooks/useFinancialCostCenterDetailsPage';

const FinancialCostCenterDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const financialCostCenterDetailsPage = useFinancialCostCenterDetailsPage(id ?? '');

  return (
    <EntityDetailsPage
      viewState={financialCostCenterDetailsPage.viewState}
      content={{
        pageTitle: 'Detalhes do centro de custo',
        pageSubtitle: 'Consulte dados cadastrais e status do centro de custo.',
        loadingLabel: 'Carregando centro de custo...',
        emptyTitle: 'Centro de custo não encontrado',
        emptyMessage: 'Não encontramos dados para este centro de custo.',
        errorFallback: 'Não foi possível carregar detalhes do centro de custo.',
        unauthorizedTitle: 'Acesso não autenticado',
        unauthorizedMessage: 'Entre novamente para consultar centros de custo.',
        forbiddenTitle: 'Acesso sem permissão',
        forbiddenMessage: 'Seu perfil não possui permissão para consultar centros de custo.',
      }}
      data={financialCostCenterDetailsPage.data}
      errorMessage={financialCostCenterDetailsPage.errorMessage}
      onBack={financialCostCenterDetailsPage.onBack}
      onRetry={() => {
        void financialCostCenterDetailsPage.onRetry();
      }}
    />
  );
};

export default FinancialCostCenterDetailsPage;
