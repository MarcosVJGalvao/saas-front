import { useFinancialReferenceOptions } from '@features/client/financial/hooks/useFinancialReferenceOptions';
import { useFinancialRecordListBase } from '@features/client/financial/hooks/useFinancialRecordListBase';
import { accountsPayableService } from '@features/client/financial/services/service';

export const useAccountsPayableListPage = () => {
  const financialRecordListPage = useFinancialRecordListBase({
    mode: 'payable',
    routeBase: '/client/financial/accounts-payable',
    service: {
      list: (params) => accountsPayableService.list(params),
      settle: (id, payload) => accountsPayableService.settle(id, payload),
      cancel: (id) => accountsPayableService.cancel(id),
    },
    errorMessageFallback: 'Não foi possível carregar contas a pagar.',
  });
  const referenceOptions = useFinancialReferenceOptions();

  return {
    ...financialRecordListPage,
    referenceOptions,
  };
};
