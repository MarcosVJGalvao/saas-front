import { FinancialRecordFormPage } from '@features/client/financial/components/FinancialRecordFormPage';
import { accountsPayableService } from '@features/client/financial/services/financialServices';

const AccountsPayableCreatePage = () => (
  <FinancialRecordFormPage
    title="Nova conta a pagar"
    editTitle="Editar conta a pagar"
    subtitle="Cadastre obrigações financeiras, vencimentos e centros de custo."
    backPath="/client/financial/accounts-payable"
    service={accountsPayableService}
    loadErrorMessage="Não foi possível carregar a conta a pagar."
    submitErrorMessage="Não foi possível salvar a conta a pagar."
  />
);

export default AccountsPayableCreatePage;
