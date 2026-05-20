import { useState } from 'react';
import { financialReportsService } from '@features/client/financial/services/service';

export type FinancialReportKey =
  | 'cashFlow'
  | 'accountsReceivable'
  | 'accountsPayable'
  | 'schoolDefaulting';

type FinancialReportOption = {
  key: FinancialReportKey;
  title: string;
  description: string;
};

export const financialReportOptions: FinancialReportOption[] = [
  {
    key: 'cashFlow',
    title: 'Fluxo de caixa',
    description: 'Entradas, saídas e saldo por período.',
  },
  {
    key: 'accountsReceivable',
    title: 'Contas a receber',
    description: 'Recebíveis, vencimentos e situação de cobrança.',
  },
  {
    key: 'accountsPayable',
    title: 'Contas a pagar',
    description: 'Obrigações, vencimentos e pagamentos confirmados.',
  },
  {
    key: 'schoolDefaulting',
    title: 'Inadimplência escolar',
    description: 'Pendências financeiras vinculadas ao contexto acadêmico.',
  },
];

const getReportTitle = (reportKey: FinancialReportKey): string =>
  financialReportOptions.find((reportOption) => reportOption.key === reportKey)?.title ??
  'Relatório financeiro';

export const useFinancialReportsPage = () => {
  const [loadingKey, setLoadingKey] = useState<FinancialReportKey | undefined>();
  const [loadedReport, setLoadedReport] = useState<FinancialReportKey | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const requestReport = async (reportKey: FinancialReportKey): Promise<void> => {
    setLoadingKey(reportKey);
    setLoadedReport(undefined);
    setErrorMessage(undefined);
    try {
      const params = { page: 1, limit: 10 };
      if (reportKey === 'cashFlow') {
        await financialReportsService.getCashFlow(params);
      } else if (reportKey === 'accountsReceivable') {
        await financialReportsService.getAccountsReceivable(params);
      } else if (reportKey === 'accountsPayable') {
        await financialReportsService.getAccountsPayable(params);
      } else {
        await financialReportsService.getSchoolDefaulting(params);
      }
      setLoadedReport(reportKey);
    } catch {
      setErrorMessage('Não foi possível carregar o relatório financeiro.');
    } finally {
      setLoadingKey(undefined);
    }
  };

  return {
    reportOptions: financialReportOptions,
    loadingKey,
    errorMessage,
    successMessage: loadedReport
      ? `${getReportTitle(loadedReport)} carregado com sucesso.`
      : undefined,
    requestReport,
  };
};
