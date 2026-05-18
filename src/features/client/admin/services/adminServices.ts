import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type {
  ClientApiRecord,
  ClientBaseQueryParams,
} from '@features/client/shared/types/clientApi.types';

type AdminQuery = ClientBaseQueryParams & ClientApiRecord;

export const clientUsersService = createClientCrudService<
  ClientApiRecord,
  ClientApiRecord,
  ClientApiRecord,
  ClientApiRecord,
  AdminQuery
>('/api/users');

export const clientRolesService = createClientCrudService<
  ClientApiRecord,
  ClientApiRecord,
  ClientApiRecord,
  ClientApiRecord,
  AdminQuery
>('/api/roles');
