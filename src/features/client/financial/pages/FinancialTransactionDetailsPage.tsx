import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useFinancialTransactionDetailsPage } from '@features/client/financial/hooks/useFinancialTransactionDetailsPage';

const FinancialTransactionDetailsRoutePage = () => {
  const { id } = useParams<{ id: string }>();
  const financialTransactionDetailsPage = useFinancialTransactionDetailsPage(id ?? '');

  return (
    <EntityDetailsPage
      viewState={financialTransactionDetailsPage.viewState}
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
      data={financialTransactionDetailsPage.data}
      errorMessage={financialTransactionDetailsPage.errorMessage}
      onBack={financialTransactionDetailsPage.onBack}
      onRetry={() => {
        void financialTransactionDetailsPage.onRetry();
      }}
    />
  );
};

export default FinancialTransactionDetailsRoutePage;
