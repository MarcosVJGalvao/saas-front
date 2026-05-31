import { httpClient } from '@shared/services/httpClient';
import type {
  ClientPermissionsListResponse,
  ClientRoleCreateRequest,
  ClientRoleDetailsResponse,
  ClientRolesListParams,
  ClientRolesListResponse,
  ClientRoleUpdateRequest,
  ClientRoleUpdateResponse,
  ClientUserCreateRequest,
  ClientUserDeleteResponse,
  ClientUserDetailsResponse,
  ClientUsersListParams,
  ClientUsersListResponse,
  ClientUserUpdateRequest,
  ClientUserUpdateResponse,
} from './types';

const USERS_BASE_PATH = '/api/users';
const ROLES_BASE_PATH = '/api/roles';
const PERMISSIONS_BASE_PATH = '/api/permissions';

export const adminEndpoints = {
  listUsers: (params: ClientUsersListParams) =>
    httpClient.get<ClientUsersListResponse>(USERS_BASE_PATH, { params }),
  getUserById: (id: string) =>
    httpClient.get<ClientUserDetailsResponse>(`${USERS_BASE_PATH}/${id}`),
  createUser: (payload: ClientUserCreateRequest) =>
    httpClient.post<ClientUserDetailsResponse>(USERS_BASE_PATH, payload),
  updateUser: (id: string, payload: ClientUserUpdateRequest) =>
    httpClient.patch<ClientUserUpdateResponse>(`${USERS_BASE_PATH}/${id}`, payload),
  removeUser: (id: string) =>
    httpClient.delete<ClientUserDeleteResponse>(`${USERS_BASE_PATH}/${id}`),

  listRoles: (params: ClientRolesListParams) =>
    httpClient.get<ClientRolesListResponse>(ROLES_BASE_PATH, { params }),
  getRoleById: (id: string) =>
    httpClient.get<ClientRoleDetailsResponse>(`${ROLES_BASE_PATH}/${id}`),
  createRole: (payload: ClientRoleCreateRequest) =>
    httpClient.post<ClientRoleDetailsResponse>(ROLES_BASE_PATH, payload),
  updateRole: (id: string, payload: ClientRoleUpdateRequest) =>
    httpClient.patch<ClientRoleUpdateResponse>(`${ROLES_BASE_PATH}/${id}`, payload),

  listPermissions: (params?: { page?: number; limit?: number }) =>
    httpClient.get<ClientPermissionsListResponse>(PERMISSIONS_BASE_PATH, { params }),
};
