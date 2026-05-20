import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { ClientAdminEntity, ClientUser } from '@features/client/admin/types/admin.types';

type AdminEntityListActions = {
  onDetails: (entity: ClientAdminEntity) => void;
  onEdit: (entity: ClientAdminEntity) => void;
};

const hasEmail = (entity: ClientAdminEntity): entity is ClientUser => 'email' in entity;

const getName = (entity: ClientAdminEntity): string =>
  hasEmail(entity) ? (entity.fullName ?? entity.name ?? '-') : entity.name;

const getEmail = (entity: ClientAdminEntity): string =>
  hasEmail(entity) ? (entity.email ?? '-') : '-';

const getRole = (entity: ClientAdminEntity): string =>
  hasEmail(entity) ? (entity.role?.name ?? '-') : '-';

const getPermissions = (entity: ClientAdminEntity): string =>
  'permissionsCount' in entity ? String(entity.permissionsCount ?? 0) : '-';

const renderStatus = (entity: ClientAdminEntity) =>
  entity.status ? (
    <LocalizedStatusBadge
      label={translateActiveInactiveStatus(entity.status)}
      tone={entity.status === 'active' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

export const buildAdminEntityColumns = (
  actions: AdminEntityListActions,
  showRole: boolean,
  showPermissions: boolean,
): DataTableColumn<ClientAdminEntity>[] => [
  {
    key: 'name',
    header: 'Nome',
    render: getName,
    mobileRender: getName,
  },
  ...(showRole
    ? [
        {
          key: 'role',
          header: 'Perfil',
          render: getRole,
          mobileRender: getRole,
        } satisfies DataTableColumn<ClientAdminEntity>,
      ]
    : []),
  ...(showPermissions
    ? [
        {
          key: 'permissions',
          header: 'Permissões',
          render: getPermissions,
          mobileRender: getPermissions,
        } satisfies DataTableColumn<ClientAdminEntity>,
      ]
    : []),
  {
    key: 'email',
    header: 'E-mail',
    render: getEmail,
    mobileRender: getEmail,
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (entity) => (entity.status ? translateActiveInactiveStatus(entity.status) : '-'),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (entity) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações de ${getName(entity)}`}
        actions={[
          { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(entity) },
          { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(entity) },
        ]}
      />
    ),
  },
];

export const buildAdminEntityMobileConfig = (
  actions: AdminEntityListActions,
  showRole: boolean,
  showPermissions: boolean,
): DataListMobileConfig<ClientAdminEntity> => ({
  renderTitle: getName,
  renderSubtitle: (entity) => (showRole ? getRole(entity) : getEmail(entity)),
  renderStatus,
  renderActions: (entity) => (
    <RowActionsMenu
      triggerAriaLabel={`Abrir ações de ${getName(entity)}`}
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(entity) },
        { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(entity) },
      ]}
    />
  ),
  renderDetails: (entity) => (
    <AppStack spacing={1}>
      {showRole ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Perfil
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getRole(entity)}
          </AppText>
        </AppStack>
      ) : null}
      {showPermissions ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Permissões
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getPermissions(entity)}
          </AppText>
        </AppStack>
      ) : null}
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          E-mail
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {getEmail(entity)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
