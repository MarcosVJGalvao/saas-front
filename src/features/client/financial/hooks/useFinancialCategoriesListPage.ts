import { financialCategoriesService } from '@features/client/financial/services/service';
import { useFinancialEntityListBase } from '@features/client/financial/hooks/useFinancialEntityListBase';

export const useFinancialCategoriesListPage = () =>
  useFinancialEntityListBase({
    routeBase: '/client/financial/categories',
    service: {
      list: (params) => financialCategoriesService.list(params),
    },
    errorMessageFallback: 'Não foi possível carregar categorias financeiras.',
    showType: true,
  });
