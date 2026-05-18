import { FinancialRecordsPage } from '@features/client/financial/components/FinancialRecordsPage';
import { accountsPayableService } from '@features/client/financial/services/financialServices';

const AccountsPayablePage = () => (
  <FinancialRecordsPage
    mode="payable"
    title="Contas a pagar"
    subtitle="Gerencie títulos, pagamentos, cancelamentos e recorrências."
    service={accountsPayableService}
    errorMessageFallback="Não foi possível carregar contas a pagar."
    emptyTitle="Nenhuma conta a pagar encontrada"
    emptyDescription="Cadastre obrigações financeiras para acompanhar vencimentos."
  />
);

export default AccountsPayablePage;
