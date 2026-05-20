import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useAccountsPayableDetailsPage } from '@features/client/financial/hooks/useAccountsPayableDetailsPage';

const AccountsPayableDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const accountsPayableDetailsPage = useAccountsPayableDetailsPage(id ?? '');

  return (
    <EntityDetailsPage
      viewState={accountsPayableDetailsPage.viewState}
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
      data={accountsPayableDetailsPage.data}
      errorMessage={accountsPayableDetailsPage.errorMessage}
      onBack={accountsPayableDetailsPage.onBack}
      onRetry={() => {
        void accountsPayableDetailsPage.onRetry();
      }}
    />
  );
};

export default AccountsPayableDetailsPage;
