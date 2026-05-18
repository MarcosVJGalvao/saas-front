import { FinancialEntityDetailsPage } from '@features/client/financial/components/FinancialEntityDetailsPage';
import { financialCostCenterService } from '@features/client/financial/services/financialServices';

const FinancialCostCenterDetailsPage = () => (
  <FinancialEntityDetailsPage
    service={financialCostCenterService}
    backPath="/client/financial/cost-centers"
    fallbackSubtitle="Centro de custo"
    errorMessageFallback="Não foi possível carregar detalhes do centro de custo."
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
  />
);

export default FinancialCostCenterDetailsPage;
