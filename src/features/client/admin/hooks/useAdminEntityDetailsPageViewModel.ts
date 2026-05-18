import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { ClientAdminEntity, ClientUser } from '@features/client/admin/types/admin.types';

type AdminEntityDetailsService = {
  getById: (id: string) => Promise<ClientAdminEntity>;
};

type AdminEntityDetailsPageViewModelParams = {
  service: AdminEntityDetailsService;
  backPath: string;
  content: EntityDetailsPageContent;
  fallbackSubtitle: string;
  showRole?: boolean | undefined;
  showPermissions?: boolean | undefined;
};

const hasEmail = (row: ClientAdminEntity): row is ClientUser => 'email' in row;

const getName = (row: ClientAdminEntity): string =>
  hasEmail(row) ? (row.fullName ?? row.name ?? '-') : row.name;

const getEmail = (row: ClientAdminEntity): string => (hasEmail(row) ? (row.email ?? '-') : '-');

const getRole = (row: ClientAdminEntity): string => (hasEmail(row) ? (row.role?.name ?? '-') : '-');

const getPermissions = (row: ClientAdminEntity): string =>
  'permissionsCount' in row ? String(row.permissionsCount ?? 0) : '-';

const getDescription = (row: ClientAdminEntity): string =>
  'description' in row ? (row.description ?? '-') : '-';

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

export const useAdminEntityDetailsPageViewModel = ({
  service,
  backPath,
  content,
  fallbackSubtitle,
  showRole = false,
  showPermissions = false,
}: AdminEntityDetailsPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<ClientAdminEntity | null>(null);
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
      : item
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: item
        ? {
            title: getName(item),
            subtitle: getEmail(item) !== '-' ? getEmail(item) : fallbackSubtitle,
            avatarFallback: getName(item).slice(0, 1).toUpperCase(),
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
                    { label: 'Nome', value: getName(item) },
                    { label: 'E-mail', value: getEmail(item) },
                    ...(showRole ? [{ label: 'Perfil', value: getRole(item) }] : []),
                    ...(showPermissions
                      ? [{ label: 'Permissões', value: getPermissions(item) }]
                      : []),
                    {
                      label: 'Status',
                      value: item.status ? translateActiveInactiveStatus(item.status) : '-',
                    },
                    {
                      label: 'Descrição',
                      value: getDescription(item),
                    },
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
    [fallbackSubtitle, item, showPermissions, showRole],
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
