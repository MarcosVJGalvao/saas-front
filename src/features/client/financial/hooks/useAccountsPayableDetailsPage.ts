import { accountsPayableService } from '@features/client/financial/services/service';
import { useFinancialRecordDetailsBase } from '@features/client/financial/hooks/useFinancialRecordDetailsBase';

export const useAccountsPayableDetailsPage = (id: string) =>
  useFinancialRecordDetailsBase({
    id,
    backPath: '/client/financial/accounts-payable',
    service: {
      getById: (recordId) => accountsPayableService.getById(recordId),
    },
    errorMessageFallback: 'Não foi possível carregar detalhes da conta a pagar.',
    fallbackSubtitle: 'Conta a pagar',
  });
