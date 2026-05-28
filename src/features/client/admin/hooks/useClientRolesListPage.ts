import { clientRolesService } from '@features/client/admin/services/service';
import type { ClientRole } from '@features/client/admin/types/admin.types';
import { useAdminEntityListBase } from './useAdminEntityListBase';

export const useClientRolesListPage = () =>
  useAdminEntityListBase<ClientRole>({
    routeBase: '/client/roles',
    service: clientRolesService,
    errorMessageFallback: 'Não foi possível carregar perfis.',
    showRole: false,
    showPermissions: false,
    showDescription: true,
    showEmail: false,
    showStatus: false,
  });
