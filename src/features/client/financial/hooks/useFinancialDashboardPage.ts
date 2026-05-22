import { useCallback, useEffect, useState } from 'react';
import type { FinancialDashboardSummary } from '@features/client/financial/types/financial.types';
import { financialDashboardService } from '@features/client/financial/services/service';

export const useFinancialDashboardPage = () => {
  const [summary, setSummary] = useState<FinancialDashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const reload = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await financialDashboardService.getSummary({});
      setSummary(response);
    } catch {
      setErrorMessage('Não foi possível carregar o dashboard financeiro.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reload();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [reload]);

  return {
    summary,
    loading,
    errorMessage,
    empty: !loading && !errorMessage && summary === null,
    reload,
  };
};
