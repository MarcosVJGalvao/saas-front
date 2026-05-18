import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import {
  translateFinancialOriginType,
  translateFinancialRecordStatus,
  translateFinancialTransactionType,
} from '@shared/i18n/pt-BR/enums';
import type { FinancialTransaction } from '@features/client/financial/types/financial.types';

type FinancialTransactionDetailsService = {
  getById: (id: string) => Promise<FinancialTransaction>;
};

type FinancialTransactionDetailsPageViewModelParams = {
  service: FinancialTransactionDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
};

const getDescription = (transaction: FinancialTransaction): string =>
  transaction.description || '-';

const getAmount = (transaction: FinancialTransaction): string =>
  transaction.amount === undefined ? '-' : formatCurrency(transaction.amount, 'BRL');

const getOrigin = (transaction: FinancialTransaction): string =>
  transaction.originType ? translateFinancialOriginType(transaction.originType) : '-';

const getStatus = (transaction: FinancialTransaction): string =>
  transaction.status ? translateFinancialRecordStatus(transaction.status) : '-';

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

export const useFinancialTransactionDetailsPageViewModel = ({
  service,
  backPath,
  content,
}: FinancialTransactionDetailsPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transaction, setTransaction] = useState<FinancialTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setTransaction(null);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await service.getById(id);
      setTransaction(response);
    } catch {
      setErrorMessage(content.errorFallback);
    } finally {
      setLoading(false);
    }
  }, [content.errorFallback, id, service]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : transaction
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: transaction
        ? {
            title: getDescription(transaction),
            subtitle: getAmount(transaction),
            avatarFallback: 'T',
            statusLabel: getStatus(transaction),
            statusColor: transaction.status === 'paid' ? 'success' : 'default',
          }
        : null,
      tabs: transaction
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'main',
                  title: 'Dados da transação',
                  items: [
                    { label: 'Descrição', value: getDescription(transaction) },
                    { label: 'Tipo', value: translateFinancialTransactionType(transaction.type) },
                    { label: 'Origem', value: getOrigin(transaction) },
                    { label: 'Status', value: getStatus(transaction) },
                    { label: 'Valor', value: getAmount(transaction) },
                    {
                      label: 'Data da transação',
                      value: formatDate(transaction.transactionDate),
                    },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(transaction.createdAt) },
                    { label: 'Atualizado em', value: formatDate(transaction.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [transaction],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate(backPath),
    onRetry: load,
  };
};
