import { accountsReceivableService } from '@features/client/financial/services/service';
import { useFinancialRecordListBase } from '@features/client/financial/hooks/useFinancialRecordListBase';

export const useAccountsReceivableListPage = () =>
  useFinancialRecordListBase({
    mode: 'receivable',
    routeBase: '/client/financial/accounts-receivable',
    service: {
      list: (params) => accountsReceivableService.list(params),
      settle: (id, payload) => accountsReceivableService.settle(id, payload),
      cancel: (id) => accountsReceivableService.cancel(id),
    },
    errorMessageFallback: 'Não foi possível carregar contas a receber.',
  });
