import { financialCategoriesService } from '@features/client/financial/services/service';
import { useFinancialEntitiesList } from '@features/client/financial/hooks/useFinancialEntitiesList';

export const useFinancialCategoriesList = () =>
  useFinancialEntitiesList(
    {
      list: (params) => financialCategoriesService.list(params),
    },
    'Não foi possível carregar categorias financeiras.',
  );
