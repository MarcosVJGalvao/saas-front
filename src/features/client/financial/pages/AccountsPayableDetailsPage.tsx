import { FinancialRecordDetailsPage } from '@features/client/financial/components/FinancialRecordDetailsPage';
import { accountsPayableService } from '@features/client/financial/services/financialServices';

const AccountsPayableDetailsPage = () => (
  <FinancialRecordDetailsPage
    service={accountsPayableService}
    backPath="/client/financial/accounts-payable"
    fallbackSubtitle="Conta a pagar"
    content={{
      pageTitle: 'Detalhes da conta a pagar',
      pageSubtitle: 'Consulte vencimento, status, valor e vínculos financeiros da conta.',
      loadingLabel: 'Carregando conta a pagar...',
      emptyTitle: 'Conta a pagar não encontrada',
      emptyMessage: 'Não encontramos dados para esta conta a pagar.',
      errorFallback: 'Não foi possível carregar detalhes da conta a pagar.',
      unauthorizedTitle: 'Acesso não autenticado',
      unauthorizedMessage: 'Entre novamente para consultar contas a pagar.',
      forbiddenTitle: 'Acesso sem permissão',
      forbiddenMessage: 'Seu perfil não possui permissão para consultar contas a pagar.',
    }}
  />
);

export default AccountsPayableDetailsPage;
