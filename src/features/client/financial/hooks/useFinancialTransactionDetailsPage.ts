import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import {
  toFinancialTransactionDetailsTabs,
  toFinancialTransactionHeaderData,
} from '@features/client/financial/normalizers/financialTransactionDetails.normalizer';
import { financialTransactionsService } from '@features/client/financial/services/service';
import type { FinancialTransaction } from '@features/client/financial/types/financial.types';

export const useFinancialTransactionDetailsPage = (
  id: string,
): {
  viewState: EntityDetailsViewState;
  data: EntityDetailsPageData;
  errorMessage: string | undefined;
  onBack: () => void;
  onRetry: () => Promise<void>;
} => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<FinancialTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await financialTransactionsService.getById(id);
      setTransaction(response);
    } catch {
      setErrorMessage('Não foi possível carregar detalhes da transação financeira.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  return {
    viewState: loading ? 'loading' : errorMessage ? 'error' : transaction ? 'ready' : 'empty',
    data: {
      headerData: transaction ? toFinancialTransactionHeaderData(transaction) : null,
      tabs: transaction ? toFinancialTransactionDetailsTabs(transaction) : [],
    },
    errorMessage,
    onBack: () => {
      void navigate('/client/financial/transactions');
    },
    onRetry: load,
  };
};
