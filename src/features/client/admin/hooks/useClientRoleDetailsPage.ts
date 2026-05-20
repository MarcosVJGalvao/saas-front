import { clientRolesService } from '@features/client/admin/services/service';
import { useAdminDetailsBase } from './useAdminDetailsBase';

export const useClientRoleDetailsPage = (id: string) =>
  useAdminDetailsBase({
    id,
    backPath: '/client/roles',
    service: clientRolesService,
    errorMessageFallback: 'Não foi possível carregar detalhes do perfil.',
    fallbackSubtitle: 'Perfil de acesso',
  });
