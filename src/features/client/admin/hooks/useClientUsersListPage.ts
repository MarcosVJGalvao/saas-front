import { clientUsersService } from '@features/client/admin/services/service';
import type { ClientUser } from '@features/client/admin/types/admin.types';
import { useAdminEntityListBase } from './useAdminEntityListBase';

export const useClientUsersListPage = () =>
  useAdminEntityListBase<ClientUser>({
    routeBase: '/client/users',
    service: clientUsersService,
    errorMessageFallback: 'Não foi possível carregar usuários.',
    showRole: true,
    showPermissions: false,
  });
