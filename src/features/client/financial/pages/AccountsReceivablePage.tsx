import { FinancialRecordsPage } from '@features/client/financial/components/FinancialRecordsPage';
import { accountsReceivableService } from '@features/client/financial/services/financialServices';

const AccountsReceivablePage = () => (
  <FinancialRecordsPage
    mode="receivable"
    title="Contas a receber"
    subtitle="Gerencie recebíveis vinculados a alunos, matrículas e turmas."
    routeBase="/client/financial/accounts-receivable"
    service={accountsReceivableService}
    errorMessageFallback="Não foi possível carregar contas a receber."
    emptyTitle="Nenhuma conta a receber encontrada"
    emptyDescription="Recebíveis de alunos e matrículas serão exibidos nesta consulta."
  />
);

export default AccountsReceivablePage;
