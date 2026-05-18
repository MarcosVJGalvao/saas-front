import { FinancialRecordDetailsPage } from '@features/client/financial/components/FinancialRecordDetailsPage';
import { accountsReceivableService } from '@features/client/financial/services/financialServices';

const AccountsReceivableDetailsPage = () => (
  <FinancialRecordDetailsPage
    service={accountsReceivableService}
    backPath="/client/financial/accounts-receivable"
    fallbackSubtitle="Conta a receber"
    content={{
      pageTitle: 'Detalhes da conta a receber',
      pageSubtitle: 'Consulte vencimento, status, valor e vínculos financeiros do recebível.',
      loadingLabel: 'Carregando conta a receber...',
      emptyTitle: 'Conta a receber não encontrada',
      emptyMessage: 'Não encontramos dados para esta conta a receber.',
      errorFallback: 'Não foi possível carregar detalhes da conta a receber.',
      unauthorizedTitle: 'Acesso não autenticado',
      unauthorizedMessage: 'Entre novamente para consultar contas a receber.',
      forbiddenTitle: 'Acesso sem permissão',
      forbiddenMessage: 'Seu perfil não possui permissão para consultar contas a receber.',
    }}
  />
);

export default AccountsReceivableDetailsPage;
