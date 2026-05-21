import { clientUsersService } from '@features/client/admin/services/service';
import { useAdminDetailsBase } from './useAdminDetailsBase';

export const useClientUserDetailsPage = (id: string) =>
  useAdminDetailsBase({
    id,
    backPath: '/client/users',
    service: clientUsersService,
    errorMessageFallback: 'Não foi possível carregar detalhes do usuário.',
    fallbackSubtitle: 'Usuário do tenant',
  });
