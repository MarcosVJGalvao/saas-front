import { accountsPayableService } from '@features/client/financial/services/service';
import { useFinancialRecordsList } from '@features/client/financial/hooks/useFinancialRecordsList';

export const useAccountsPayableList = () =>
  useFinancialRecordsList(
    {
      list: (params) => accountsPayableService.list(params),
    },
    'Não foi possível carregar contas a pagar.',
  );
