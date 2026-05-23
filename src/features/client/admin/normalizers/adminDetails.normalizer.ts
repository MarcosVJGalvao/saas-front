import { formatIsoDate } from '@shared/formatters';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import type {
  ClientAdminEntity,
  ClientRole,
  ClientUser,
} from '@features/client/admin/types/admin.types';

const hasEmail = (entity: ClientAdminEntity): entity is ClientUser => 'email' in entity;

const isRole = (entity: ClientAdminEntity): entity is ClientRole => 'permissionsCount' in entity;

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const getTitle = (entity: ClientAdminEntity): string =>
  hasEmail(entity) ? (entity.fullName ?? entity.name ?? '-') : entity.name;

const getSubtitle = (entity: ClientAdminEntity, fallbackSubtitle: string): string =>
  hasEmail(entity) ? (entity.email ?? fallbackSubtitle) : fallbackSubtitle;

const renderEntityStatus = (status: ClientAdminEntity['status']) =>
  createOptionalLocalizedStatusBadge(
    status ? translateActiveInactiveStatus(status) : undefined,
    status === 'active' ? 'active' : 'neutral',
  );

export const toAdminDetailsData = (
  entity: ClientAdminEntity,
  fallbackSubtitle: string,
): EntityDetailsPageData => ({
  headerData: {
    title: getTitle(entity),
    subtitle: getSubtitle(entity, fallbackSubtitle),
    avatarFallback: getTitle(entity).slice(0, 1).toUpperCase(),
    statusLabel: entity.status ? translateActiveInactiveStatus(entity.status) : undefined,
    statusColor: entity.status === 'active' ? 'success' : 'default',
  },
  tabs: [
    {
      id: 'summary',
      label: 'Resumo',
      sections: [
        {
          id: 'main',
          title: 'Dados principais',
          items: hasEmail(entity)
            ? [
                { label: 'Nome', value: getTitle(entity) },
                { label: 'E-mail', value: entity.email ?? '-' },
                { label: 'Perfil', value: entity.role?.name ?? '-' },
                { label: 'Status', value: renderEntityStatus(entity.status) },
              ]
            : [
                { label: 'Nome', value: entity.name },
                { label: 'Descrição', value: entity.description ?? '-' },
                { label: 'Permissões', value: String(entity.permissionsCount ?? 0) },
                { label: 'Status', value: renderEntityStatus(entity.status) },
              ],
        },
        {
          id: 'control',
          title: 'Controle',
          items: [
            { label: 'Criado em', value: formatDate(entity.createdAt) },
            { label: 'Atualizado em', value: formatDate(entity.updatedAt) },
            ...(isRole(entity)
              ? [{ label: 'Permissões cadastradas', value: String(entity.permissionsCount ?? 0) }]
              : []),
          ],
        },
      ],
    },
  ],
});
