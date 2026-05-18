import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { translateFinancialRecordStatus } from '@shared/i18n/pt-BR/enums';
import type { FinancialRecord } from '@features/client/financial/types/financial.types';

type FinancialRecordDetailsService = {
  getById: (id: string) => Promise<FinancialRecord>;
};

type FinancialRecordDetailsPageViewModelParams = {
  service: FinancialRecordDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  fallbackSubtitle: string;
};

const getDescription = (record: FinancialRecord): string =>
  record.description ?? record.name ?? '-';

const getAmount = (record: FinancialRecord): string =>
  record.amount === undefined ? '-' : formatCurrency(record.amount, 'BRL');

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const getSettlementDate = (record: FinancialRecord): string =>
  formatDate(record.paymentDate ?? record.receivedDate);

const isSettled = (record: FinancialRecord): boolean =>
  record.status === 'paid' || record.status === 'received';

export const useFinancialRecordDetailsPageViewModel = ({
  service,
  backPath,
  content,
  fallbackSubtitle,
}: FinancialRecordDetailsPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setRecord(null);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await service.getById(id);
      setRecord(response);
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
      : record
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: record
        ? {
            title: getDescription(record),
            subtitle: getAmount(record) !== '-' ? getAmount(record) : fallbackSubtitle,
            avatarFallback: 'F',
            statusLabel: translateFinancialRecordStatus(record.status),
            statusColor: isSettled(record) ? 'success' : 'default',
          }
        : null,
      tabs: record
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'main',
                  title: 'Dados financeiros',
                  items: [
                    { label: 'Descrição', value: getDescription(record) },
                    { label: 'Status', value: translateFinancialRecordStatus(record.status) },
                    { label: 'Valor', value: getAmount(record) },
                    { label: 'Vencimento', value: formatDate(record.dueDate) },
                    { label: 'Data de baixa', value: getSettlementDate(record) },
                    { label: 'Categoria', value: record.category?.name ?? '-' },
                    { label: 'Centro de custo', value: record.costCenter?.name ?? '-' },
                    { label: 'Aluno', value: record.student?.person?.fullName ?? '-' },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(record.createdAt) },
                    { label: 'Atualizado em', value: formatDate(record.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [fallbackSubtitle, record],
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
