import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EntitySummaryCardItem } from '@shared/components/data-display/EntitySummaryCards';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { financialDashboardService } from '@features/client/financial/services/financialServices';
import type { FinancialDashboardSummary } from '@features/client/financial/types/financial.types';

const formatMoney = (value: number | undefined): string => formatCurrency(value ?? 0, 'BRL');

export const useFinancialDashboardPageViewModel = () => {
  const [summary, setSummary] = useState<FinancialDashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await financialDashboardService.getSummary({ page: 1, limit: 1 });
      setSummary(response);
    } catch {
      setErrorMessage('Não foi possível carregar o dashboard financeiro.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const cards: EntitySummaryCardItem[] = useMemo(
    () => [
      {
        key: 'receivable',
        title: 'Total a receber',
        value: formatMoney(summary?.totalReceivable),
        delta: `${summary?.openReceivables ?? 0} registros em aberto`,
        icon: <TrendingUpOutlinedIcon fontSize="small" color="success" />,
        color: 'success.main',
      },
      {
        key: 'payable',
        title: 'Total a pagar',
        value: formatMoney(summary?.totalPayable),
        delta: `${summary?.openPayables ?? 0} obrigações em aberto`,
        icon: <TrendingDownOutlinedIcon fontSize="small" color="warning" />,
        color: 'warning.main',
      },
      {
        key: 'received',
        title: 'Recebido',
        value: formatMoney(summary?.totalReceived),
        delta: 'Baixas confirmadas',
        icon: <AccountBalanceWalletOutlinedIcon fontSize="small" color="success" />,
        color: 'success.main',
      },
      {
        key: 'overdue',
        title: 'Em atraso',
        value: formatMoney(summary?.overdueAmount),
        delta: 'Pendências financeiras',
        icon: <WarningAmberOutlinedIcon fontSize="small" color="error" />,
        color: 'error.main',
      },
    ],
    [summary],
  );

  return {
    cards,
    loading,
    errorMessage,
    empty: !loading && !errorMessage && summary === null,
    reload: load,
  };
};
