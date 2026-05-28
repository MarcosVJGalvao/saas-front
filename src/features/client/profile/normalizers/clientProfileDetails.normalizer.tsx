import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { PermissionChipList } from '@shared/components/data-display/PermissionChipList';
import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import type { ClientMeResponse } from '@features/client/auth/services/types';

export const toClientProfileDetailsData = (
  profile: ClientMeResponse,
  onChangePassword: () => void,
): EntityDetailsPageData => ({
  headerData: {
    title: profile.name,
    subtitle: profile.email,
    avatarFallback: profile.name.slice(0, 2).toUpperCase(),
    statusLabel: profile.status,
    statusColor: profile.status === 'Ativo' ? 'success' : 'default',
  },
  tabs: [
    {
      id: 'summary',
      label: 'Resumo',
      sections: [
        {
          id: 'identity',
          title: 'Dados principais',
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
          id: 'organization',
          title: 'Contexto do cliente',
          items: [
            { label: 'Tenant', value: profile.tenant.name },
            { label: 'ID do tenant', value: profile.tenantId },
            { label: 'Perfil no cliente', value: profile.client.role },
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
