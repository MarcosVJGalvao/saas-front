import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type {
  ClientAdminPayload,
  ClientAdminQueryParams,
  ClientRole,
  ClientUser,
} from '@features/client/admin/types/admin.types';

export const clientUsersService = createClientCrudService<
  ClientUser,
  ClientUser,
  ClientAdminPayload,
  ClientAdminPayload,
  ClientAdminQueryParams
>('/api/users');

export const clientRolesService = createClientCrudService<
  ClientRole,
  ClientRole,
  ClientAdminPayload,
  ClientAdminPayload,
  ClientAdminQueryParams
>('/api/roles');
