import { FinancialTransactionDetailsPage } from '@features/client/financial/components/FinancialTransactionDetailsPage';
import { financialTransactionService } from '@features/client/financial/services/financialServices';

const FinancialTransactionDetailsRoutePage = () => (
  <FinancialTransactionDetailsPage
    service={financialTransactionService}
    backPath="/client/financial/transactions"
    content={{
      pageTitle: 'Detalhes da transação',
      pageSubtitle: 'Consulte origem, tipo, status e valor da movimentação financeira.',
      loadingLabel: 'Carregando transação financeira...',
      emptyTitle: 'Transação não encontrada',
      emptyMessage: 'Não encontramos dados para esta transação financeira.',
      errorFallback: 'Não foi possível carregar detalhes da transação financeira.',
      unauthorizedTitle: 'Acesso não autenticado',
      unauthorizedMessage: 'Entre novamente para consultar transações financeiras.',
      forbiddenTitle: 'Acesso sem permissão',
      forbiddenMessage: 'Seu perfil não possui permissão para consultar transações financeiras.',
    }}
  />
);

export default FinancialTransactionDetailsRoutePage;
