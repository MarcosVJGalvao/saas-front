import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { ClientAdminEntity, ClientUser } from '@features/client/admin/types/admin.types';

type AdminEntitiesPresentationParams = {
  buildRowActions: (row: ClientAdminEntity) => RowActionItem[];
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

const renderStatus = (row: ClientAdminEntity) =>
  row.status ? (
    <LocalizedStatusBadge
      label={translateActiveInactiveStatus(row.status)}
      tone={row.status === 'active' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

const renderActions = (
  row: ClientAdminEntity,
  buildRowActions: (row: ClientAdminEntity) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações de ${getName(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildAdminEntitiesTableColumns = ({
  buildRowActions,
  showRole = false,
  showPermissions = false,
}: AdminEntitiesPresentationParams): DataTableColumn<ClientAdminEntity>[] => {
  const roleColumns: DataTableColumn<ClientAdminEntity>[] = showRole
    ? [
        {
          key: 'role',
          header: 'Perfil',
          render: getRole,
          mobileRender: getRole,
        },
      ]
    : [];

  const permissionColumns: DataTableColumn<ClientAdminEntity>[] = showPermissions
    ? [
        {
          key: 'permissions',
          header: 'Permissões',
          render: getPermissions,
          mobileRender: getPermissions,
        },
      ]
    : [];

  return [
    {
      key: 'name',
      header: 'Nome',
      render: getName,
      mobileRender: getName,
    },
    ...roleColumns,
    ...permissionColumns,
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
      mobileRender: (row) => (row.status ? translateActiveInactiveStatus(row.status) : '-'),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      render: (row) => renderActions(row, buildRowActions),
    },
  ];
};

export const buildAdminEntitiesMobileConfig = ({
  buildRowActions,
  showRole = false,
  showPermissions = false,
}: AdminEntitiesPresentationParams): DataListMobileConfig<ClientAdminEntity> => ({
  renderTitle: getName,
  renderSubtitle: (row) => (showRole ? getRole(row) : getEmail(row)),
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      {showRole ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Perfil
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getRole(row)}
          </AppText>
        </AppStack>
      ) : null}
      {showPermissions ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Permissões
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getPermissions(row)}
          </AppText>
        </AppStack>
      ) : null}
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          E-mail
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {getEmail(row)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
