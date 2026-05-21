import { financialCostCentersService } from '@features/client/financial/services/service';
import { useFinancialEntityListBase } from '@features/client/financial/hooks/useFinancialEntityListBase';

export const useFinancialCostCentersListPage = () =>
  useFinancialEntityListBase({
    routeBase: '/client/financial/cost-centers',
    service: {
      list: (params) => financialCostCentersService.list(params),
    },
    errorMessageFallback: 'Não foi possível carregar centros de custo.',
    showType: false,
  });
