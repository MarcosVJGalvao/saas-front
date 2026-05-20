import { httpClient } from '@shared/services/httpClient';
import type {
  ClientRoleCreateRequest,
  ClientRoleDetailsResponse,
  ClientRolesListParams,
  ClientRolesListResponse,
  ClientRoleUpdateRequest,
  ClientRoleUpdateResponse,
  ClientUserCreateRequest,
  ClientUserDetailsResponse,
  ClientUsersListParams,
  ClientUsersListResponse,
  ClientUserUpdateRequest,
  ClientUserUpdateResponse,
} from './types';

const USERS_BASE_PATH = '/api/users';
const ROLES_BASE_PATH = '/api/roles';

export const adminEndpoints = {
  listUsers: (params: ClientUsersListParams) =>
    httpClient.get<ClientUsersListResponse>(USERS_BASE_PATH, { params }),
  getUserById: (id: string) =>
    httpClient.get<ClientUserDetailsResponse>(`${USERS_BASE_PATH}/${id}`),
  createUser: (payload: ClientUserCreateRequest) =>
    httpClient.post<ClientUserDetailsResponse>(USERS_BASE_PATH, payload),
  updateUser: (id: string, payload: ClientUserUpdateRequest) =>
    httpClient.patch<ClientUserUpdateResponse>(`${USERS_BASE_PATH}/${id}`, payload),

  listRoles: (params: ClientRolesListParams) =>
    httpClient.get<ClientRolesListResponse>(ROLES_BASE_PATH, { params }),
  getRoleById: (id: string) =>
    httpClient.get<ClientRoleDetailsResponse>(`${ROLES_BASE_PATH}/${id}`),
  createRole: (payload: ClientRoleCreateRequest) =>
    httpClient.post<ClientRoleDetailsResponse>(ROLES_BASE_PATH, payload),
  updateRole: (id: string, payload: ClientRoleUpdateRequest) =>
    httpClient.patch<ClientRoleUpdateResponse>(`${ROLES_BASE_PATH}/${id}`, payload),
};
