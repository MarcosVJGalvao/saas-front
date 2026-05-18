import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type {
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
} from '@features/client/academic/types/academic.types';

type AcademicCatalogDetailsService = Pick<
  ClientCrudService<
    AcademicCatalogItem,
    AcademicCatalogItem,
    Record<string, unknown>,
    Record<string, unknown>,
    AcademicCatalogQueryParams
  >,
  'getById'
>;

type AcademicCatalogDetailsPageViewModelParams = {
  service: AcademicCatalogDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  errorMessageFallback: string;
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

export const useAcademicCatalogDetailsPageViewModel = ({
  service,
  backPath,
  content,
  errorMessageFallback,
}: AcademicCatalogDetailsPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<AcademicCatalogItem | null>(null);
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
            subtitle: item.code ?? 'Cadastro acadêmico',
            avatarFallback: item.name.slice(0, 1).toUpperCase(),
            statusLabel: item.status ? translateActiveInactiveStatus(item.status) : undefined,
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
                    {
                      label: 'Status',
                      value: item.status ? translateActiveInactiveStatus(item.status) : '-',
                    },
                    { label: 'Nível de ensino', value: item.educationLevel?.name ?? '-' },
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
    [item],
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
