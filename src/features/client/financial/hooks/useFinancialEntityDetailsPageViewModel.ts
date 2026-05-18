import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import {
  translateFinancialCategoryType,
  translateFinancialEntityStatus,
} from '@shared/i18n/pt-BR/enums';
import type {
  FinancialCategory,
  FinancialEntity,
  FinancialEntityPayload,
  FinancialEntityQueryParams,
} from '@features/client/financial/types/financial.types';

type FinancialEntityDetailsService = Pick<
  ClientCrudService<
    FinancialEntity,
    FinancialEntity,
    FinancialEntityPayload,
    FinancialEntityPayload,
    FinancialEntityQueryParams
  >,
  'getById'
>;

type FinancialEntityDetailsPageViewModelParams = {
  service: FinancialEntityDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  errorMessageFallback: string;
  fallbackSubtitle: string;
  includeType?: boolean | undefined;
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const hasFinancialType = (row: FinancialEntity): row is FinancialCategory => 'type' in row;

const getTypeValue = (row: FinancialEntity): string =>
  hasFinancialType(row) ? translateFinancialCategoryType(row.type) : '-';

export const useFinancialEntityDetailsPageViewModel = ({
  service,
  backPath,
  content,
  errorMessageFallback,
  fallbackSubtitle,
  includeType = false,
}: FinancialEntityDetailsPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<FinancialEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setItem(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await service.getById(id);
      setItem(response);
    } catch {
      setErrorMessage(errorMessageFallback);
    } finally {
      setLoading(false);
    }
  }, [errorMessageFallback, id, service]);

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
      : item
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: item
        ? {
            title: item.name,
            subtitle: item.code ?? fallbackSubtitle,
            avatarFallback: item.name.slice(0, 1).toUpperCase(),
            statusLabel: item.status ? translateFinancialEntityStatus(item.status) : undefined,
            statusColor: item.status === 'active' ? 'success' : 'default',
          }
        : null,
      tabs: item
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'main',
                  title: 'Dados principais',
                  items: [
                    { label: 'Nome', value: item.name },
                    { label: 'Código', value: item.code ?? '-' },
                    ...(includeType ? [{ label: 'Tipo', value: getTypeValue(item) }] : []),
                    {
                      label: 'Status',
                      value: item.status ? translateFinancialEntityStatus(item.status) : '-',
                    },
                    { label: 'Descrição', value: item.description ?? '-' },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(item.createdAt) },
                    { label: 'Atualizado em', value: formatDate(item.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [fallbackSubtitle, includeType, item],
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
