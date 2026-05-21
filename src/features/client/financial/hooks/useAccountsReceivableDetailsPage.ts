import { accountsReceivableService } from '@features/client/financial/services/service';
import { useFinancialRecordDetailsBase } from '@features/client/financial/hooks/useFinancialRecordDetailsBase';

export const useAccountsReceivableDetailsPage = (id: string) =>
  useFinancialRecordDetailsBase({
    id,
    backPath: '/client/financial/accounts-receivable',
    service: {
      getById: (recordId) => accountsReceivableService.getById(recordId),
    },
    errorMessageFallback: 'Não foi possível carregar detalhes da conta a receber.',
    fallbackSubtitle: 'Conta a receber',
  });
