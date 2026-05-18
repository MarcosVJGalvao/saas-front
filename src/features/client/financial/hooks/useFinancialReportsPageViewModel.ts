import { useState } from 'react';
import { financialReportService } from '@features/client/financial/services/financialServices';

type FinancialReportKey =
  | 'cashFlow'
  | 'accountsReceivable'
  | 'accountsPayable'
  | 'schoolDefaulting';

type FinancialReportOption = {
  key: FinancialReportKey;
  title: string;
  description: string;
};

const reportOptions: FinancialReportOption[] = [
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

const getReportTitle = (key: FinancialReportKey): string =>
  reportOptions.find((option) => option.key === key)?.title ?? 'Relatório financeiro';

const loadReport = async (key: FinancialReportKey): Promise<void> => {
  const params = { page: 1, limit: 10 };
  if (key === 'cashFlow') {
    await financialReportService.getCashFlow(params);
  } else if (key === 'accountsReceivable') {
    await financialReportService.getAccountsReceivable(params);
  } else if (key === 'accountsPayable') {
    await financialReportService.getAccountsPayable(params);
  } else {
    await financialReportService.getSchoolDefaulting(params);
  }
};

export const useFinancialReportsPageViewModel = () => {
  const [loadingKey, setLoadingKey] = useState<FinancialReportKey | undefined>(undefined);
  const [loadedReport, setLoadedReport] = useState<FinancialReportKey | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const requestReport = async (key: FinancialReportKey): Promise<void> => {
    setLoadingKey(key);
    setLoadedReport(undefined);
    setErrorMessage(undefined);
    try {
      await loadReport(key);
      setLoadedReport(key);
    } catch {
      setErrorMessage('Não foi possível carregar o relatório financeiro.');
    } finally {
      setLoadingKey(undefined);
    }
  };

  return {
    reportOptions,
    loadingKey,
    errorMessage,
    successMessage: loadedReport
      ? `${getReportTitle(loadedReport)} carregado com sucesso.`
      : undefined,
    requestReport,
  };
};
