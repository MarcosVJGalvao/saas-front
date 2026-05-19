import { FinancialEntitiesListPage } from '@features/client/financial/components/FinancialEntitiesListPage';
import { financialCategoryService } from '@features/client/financial/services/financialServices';

const FinancialCategoriesPage = () => (
  <FinancialEntitiesListPage
    title="Categorias financeiras"
    subtitle="Organize receitas e despesas por categoria."
    routeBase="/client/financial/categories"
    service={financialCategoryService}
    errorMessageFallback="Não foi possível carregar categorias financeiras."
    emptyTitle="Nenhuma categoria encontrada"
    emptyDescription="Cadastre categorias para classificar movimentações financeiras."
    createPermission="finance:create"
    showType
  />
);

export default FinancialCategoriesPage;
