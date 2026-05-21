import { financialCategoriesService } from '@features/client/financial/services/service';
import { useFinancialEntityDetailsBase } from '@features/client/financial/hooks/useFinancialEntityDetailsBase';

export const useFinancialCategoryDetailsPage = (id: string) =>
  useFinancialEntityDetailsBase({
    id,
    backPath: '/client/financial/categories',
    service: {
      getById: (entityId) => financialCategoriesService.getById(entityId),
    },
    errorMessageFallback: 'Não foi possível carregar detalhes da categoria financeira.',
    fallbackSubtitle: 'Categoria financeira',
    includeType: true,
  });
