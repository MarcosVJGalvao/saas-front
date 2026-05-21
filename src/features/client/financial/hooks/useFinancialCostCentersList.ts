import { financialCostCentersService } from '@features/client/financial/services/service';
import { useFinancialEntitiesList } from '@features/client/financial/hooks/useFinancialEntitiesList';

export const useFinancialCostCentersList = () =>
  useFinancialEntitiesList(
    {
      list: (params) => financialCostCentersService.list(params),
    },
    'Não foi possível carregar centros de custo.',
  );
