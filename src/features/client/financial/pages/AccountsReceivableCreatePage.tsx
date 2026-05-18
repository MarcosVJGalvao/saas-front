import { FinancialRecordFormPage } from '@features/client/financial/components/FinancialRecordFormPage';
import { accountsReceivableService } from '@features/client/financial/services/financialServices';

const AccountsReceivableCreatePage = () => (
  <FinancialRecordFormPage
    title="Nova conta a receber"
    editTitle="Editar conta a receber"
    subtitle="Cadastre recebíveis vinculados a alunos, vencimentos e categorias."
    backPath="/client/financial/accounts-receivable"
    service={accountsReceivableService}
    loadErrorMessage="Não foi possível carregar a conta a receber."
    submitErrorMessage="Não foi possível salvar a conta a receber."
    includeStudent
  />
);

export default AccountsReceivableCreatePage;
