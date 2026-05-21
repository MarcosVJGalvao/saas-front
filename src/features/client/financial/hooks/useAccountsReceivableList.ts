import { accountsReceivableService } from '@features/client/financial/services/service';
import { useFinancialRecordsList } from '@features/client/financial/hooks/useFinancialRecordsList';

export const useAccountsReceivableList = () =>
  useFinancialRecordsList(
    {
      list: (params) => accountsReceivableService.list(params),
    },
    'Não foi possível carregar contas a receber.',
  );
