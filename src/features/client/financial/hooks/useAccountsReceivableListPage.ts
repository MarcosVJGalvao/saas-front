import { useFinancialReferenceOptions } from '@features/client/financial/hooks/useFinancialReferenceOptions';
import { useFinancialRecordListBase } from '@features/client/financial/hooks/useFinancialRecordListBase';
import { accountsReceivableService } from '@features/client/financial/services/service';

export const useAccountsReceivableListPage = () => {
  const financialRecordListPage = useFinancialRecordListBase({
    mode: 'receivable',
    routeBase: '/client/financial/accounts-receivable',
    service: {
      list: (params) => accountsReceivableService.list(params),
      settle: (id, payload) => accountsReceivableService.settle(id, payload),
      cancel: (id) => accountsReceivableService.cancel(id),
    },
    errorMessageFallback: 'Não foi possível carregar contas a receber.',
  });
  const referenceOptions = useFinancialReferenceOptions({
    includeStudents: true,
    includeStudentEnrollments: true,
    includeSchoolClasses: true,
  });

  return {
    ...financialRecordListPage,
    referenceOptions,
  };
};
