import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { PermissionChipList } from '@shared/components/data-display/PermissionChipList';
import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import { translateActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { PlatformMeResponse } from '@features/platform/auth/services/types';

export const toPlatformProfileDetailsData = (
  profile: PlatformMeResponse,
  onChangePassword: () => void,
): EntityDetailsPageData => ({
  headerData: {
    title: profile.name,
    subtitle: profile.email,
    avatarFallback: profile.name.slice(0, 2).toUpperCase(),
    statusLabel: translateActiveInactiveStatus(profile.status === 'Ativo' ? 'active' : 'inactive'),
    statusColor: profile.status === 'Ativo' ? 'success' : 'default',
  },
  tabs: [
    {
      id: 'summary',
      label: 'Resumo',
      sections: [
        {
          id: 'identity',
          title: 'Identidade',
          items: [
            { label: 'Nome', value: profile.name },
            { label: 'E-mail', value: profile.email },
            {
              label: 'Status',
              value: createOptionalLocalizedStatusBadge(
                profile.status,
                profile.status === 'Ativo' ? 'active' : 'neutral',
              ),
            },
            { label: 'ID do usuário', value: profile.id },
          ],
        },
        {
          id: 'roles',
          title: 'Papéis e acesso',
          items: [
            { label: 'Papéis', value: profile.roles.length > 0 ? profile.roles.join(', ') : '-' },
            { label: 'Total de permissões', value: String(profile.permissions.length) },
            {
              label: 'Permissões',
              value: <PermissionChipList permissions={profile.permissions} />,
            },
          ],
        },
      ],
    },
  ],
  footerActions: [
    {
      id: 'change-password',
      label: 'Alterar senha',
      onClick: onChangePassword,
      icon: <LockResetRoundedIcon />,
    },
  ],
});
