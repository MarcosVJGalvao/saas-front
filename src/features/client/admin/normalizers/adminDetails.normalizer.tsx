import { PermissionChipList } from '@shared/components/data-display/PermissionChipList';
import { formatIsoDate } from '@shared/formatters';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import type {
  ClientAdminEntity,
  ClientRole,
  ClientRolePermission,
  ClientUser,
} from '@features/client/admin/types/admin.types';

const hasEmail = (entity: ClientAdminEntity): entity is ClientUser => 'email' in entity;

const isRole = (entity: ClientAdminEntity): entity is ClientRole => !hasEmail(entity);

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

const renderPermissionsContent = (permissions: ClientRolePermission[]) => (
  <PermissionChipList permissions={permissions.map((perm) => perm.name)} />
);

export const toAdminDetailsData = (
  entity: ClientAdminEntity,
  fallbackSubtitle: string,
): EntityDetailsPageData => {
  const role = isRole(entity) ? entity : null;
  const permissions = role?.permissions ?? [];
  const permCount = permissions.length;

  return {
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
                  { label: 'Status', value: renderEntityStatus(entity.status) },
                ],
          },
          ...(role !== null
            ? [
                {
                  id: 'permissions',
                  title: `Permissões (${permCount})`,
                  content: renderPermissionsContent(permissions),
                },
              ]
            : []),
          {
            id: 'control',
            title: 'Controle',
            items: [
              { label: 'Criado em', value: formatDate(entity.createdAt) },
              { label: 'Atualizado em', value: formatDate(entity.updatedAt) },
            ],
          },
        ],
      },
    ],
  };
};
