import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { useAccountsReceivableDetailsPage } from '@features/client/financial/hooks/useAccountsReceivableDetailsPage';

const AccountsReceivableDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const accountsReceivableDetailsPage = useAccountsReceivableDetailsPage(id ?? '');

  return (
    <EntityDetailsPage
      viewState={accountsReceivableDetailsPage.viewState}
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
      data={accountsReceivableDetailsPage.data}
      errorMessage={accountsReceivableDetailsPage.errorMessage}
      onBack={accountsReceivableDetailsPage.onBack}
      onRetry={() => {
        void accountsReceivableDetailsPage.onRetry();
      }}
    />
  );
};

export default AccountsReceivableDetailsPage;
