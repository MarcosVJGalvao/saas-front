import { FinancialEntityFormPage } from '@features/client/financial/components/FinancialEntityFormPage';
import { financialCostCenterService } from '@features/client/financial/services/financialServices';

const FinancialCostCenterCreatePage = () => (
  <FinancialEntityFormPage
    title="Novo centro de custo"
    editTitle="Editar centro de custo"
    subtitle="Cadastre centros de custo para organizar lançamentos financeiros."
    backPath="/client/financial/cost-centers"
    service={financialCostCenterService}
    loadErrorMessage="Não foi possível carregar o centro de custo."
    submitErrorMessage="Não foi possível salvar o centro de custo."
  />
);

export default FinancialCostCenterCreatePage;
