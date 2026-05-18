import { FinancialEntityFormPage } from '@features/client/financial/components/FinancialEntityFormPage';
import { financialCategoryService } from '@features/client/financial/services/financialServices';

const FinancialCategoryCreatePage = () => (
  <FinancialEntityFormPage
    title="Nova categoria financeira"
    editTitle="Editar categoria financeira"
    subtitle="Cadastre categorias para classificar receitas e despesas."
    backPath="/client/financial/categories"
    service={financialCategoryService}
    loadErrorMessage="Não foi possível carregar a categoria financeira."
    submitErrorMessage="Não foi possível salvar a categoria financeira."
    includeType
  />
);

export default FinancialCategoryCreatePage;
