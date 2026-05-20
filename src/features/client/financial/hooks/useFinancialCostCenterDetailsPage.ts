import { financialCostCentersService } from '@features/client/financial/services/service';
import { useFinancialEntityDetailsBase } from '@features/client/financial/hooks/useFinancialEntityDetailsBase';

export const useFinancialCostCenterDetailsPage = (id: string) =>
  useFinancialEntityDetailsBase({
    id,
    backPath: '/client/financial/cost-centers',
    service: {
      getById: (entityId) => financialCostCentersService.getById(entityId),
    },
    errorMessageFallback: 'Não foi possível carregar detalhes do centro de custo.',
    fallbackSubtitle: 'Centro de custo',
    includeType: false,
  });
