import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type {
  ClientAdminEntity,
  ClientRole,
  ClientUser,
} from '@features/client/admin/types/admin.types';

type AdminEntityListActions = {
  onDetails: (entity: ClientAdminEntity) => void;
  onEdit: (entity: ClientAdminEntity) => void;
  onDelete?: ((entity: ClientAdminEntity) => void) | undefined;
};

const hasDescription = (entity: ClientAdminEntity): entity is ClientRole => 'description' in entity;

const hasEmail = (entity: ClientAdminEntity): entity is ClientUser => 'email' in entity;

const getLinkedEmployeeName = (entity: ClientUser): string | undefined =>
  entity.employee?.person?.fullName?.trim() || undefined;

const getName = (entity: ClientAdminEntity): string =>
  hasEmail(entity)
    ? (getLinkedEmployeeName(entity) ?? entity.fullName ?? entity.name ?? '-')
    : entity.name;

const getEmail = (entity: ClientAdminEntity): string =>
  hasEmail(entity) ? (entity.email ?? '-') : '-';

const getRole = (entity: ClientAdminEntity): string =>
  hasEmail(entity) ? (entity.role?.name ?? entity.roles?.[0]?.role.name ?? '-') : '-';

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

const getDescription = (entity: ClientAdminEntity): string =>
  hasDescription(entity) ? (entity.description ?? '-') : '-';

export const buildAdminEntityColumns = (
  actions: AdminEntityListActions,
  showRole: boolean,
  showPermissions: boolean,
  showDescription = false,
  showEmail = true,
  showStatus = true,
): DataTableColumn<ClientAdminEntity>[] => [
  {
    key: 'name',
    header: 'Nome',
    render: getName,
    mobileRender: getName,
    width: '28%',
  },
  ...(showRole
    ? [
        {
          key: 'role',
          header: 'Perfil',
          render: getRole,
          mobileRender: getRole,
          width: '18%',
        } satisfies DataTableColumn<ClientAdminEntity>,
      ]
    : []),
  ...(showDescription
    ? [
        {
          key: 'description',
          header: 'Descricao',
          render: getDescription,
          mobileRender: getDescription,
        } satisfies DataTableColumn<ClientAdminEntity>,
      ]
    : []),
  ...(showPermissions
    ? [
        {
          key: 'permissions',
          header: 'Permissoes',
          render: getPermissions,
          mobileRender: getPermissions,
        } satisfies DataTableColumn<ClientAdminEntity>,
      ]
    : []),
  ...(showEmail
    ? [
        {
          key: 'email',
          header: 'E-mail',
          render: getEmail,
          mobileRender: getEmail,
          width: '32%',
        } satisfies DataTableColumn<ClientAdminEntity>,
      ]
    : []),
  ...(showStatus
    ? [
        {
          key: 'status',
          header: 'Status',
          render: renderStatus,
          mobileRender: (entity) =>
            entity.status ? translateActiveInactiveStatus(entity.status) : '-',
          width: '12%',
        } satisfies DataTableColumn<ClientAdminEntity>,
      ]
    : []),
  {
    key: 'actions',
    header: 'Acoes',
    align: 'right',
    width: '10%',
    render: (entity) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir acoes de ${getName(entity)}`}
        actions={[
          { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(entity) },
          { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(entity) },
          ...(actions.onDelete
            ? [{ key: 'delete', label: 'Excluir', onClick: () => actions.onDelete?.(entity) }]
            : []),
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
      triggerAriaLabel={`Abrir acoes de ${getName(entity)}`}
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(entity) },
        { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(entity) },
        ...(actions.onDelete
          ? [{ key: 'delete', label: 'Excluir', onClick: () => actions.onDelete?.(entity) }]
          : []),
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
            Permissoes
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
