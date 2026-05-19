import { FinancialEntitiesListPage } from '@features/client/financial/components/FinancialEntitiesListPage';
import { financialCostCenterService } from '@features/client/financial/services/financialServices';

const FinancialCostCentersPage = () => (
  <FinancialEntitiesListPage
    title="Centros de custo"
    subtitle="Organize lançamentos financeiros por centro de custo."
    routeBase="/client/financial/cost-centers"
    service={financialCostCenterService}
    errorMessageFallback="Não foi possível carregar centros de custo."
    emptyTitle="Nenhum centro de custo encontrado"
    emptyDescription="Cadastre centros de custo para organizar lançamentos financeiros."
    createPermission="client:finance:create"
  />
);

export default FinancialCostCentersPage;
