import { accountsPayableService } from '@features/client/financial/services/service';
import { useFinancialRecordListBase } from '@features/client/financial/hooks/useFinancialRecordListBase';

export const useAccountsPayableListPage = () =>
  useFinancialRecordListBase({
    mode: 'payable',
    routeBase: '/client/financial/accounts-payable',
    service: {
      list: (params) => accountsPayableService.list(params),
      settle: (id, payload) => accountsPayableService.settle(id, payload),
      cancel: (id) => accountsPayableService.cancel(id),
    },
    errorMessageFallback: 'Não foi possível carregar contas a pagar.',
  });
