import { adminEndpoints } from './endpoints';
import type {
  ClientPermissionsListResponse,
  ClientRoleCreateRequest,
  ClientRoleCreateResponse,
  ClientRoleDetailsResponse,
  ClientRolesListParams,
  ClientRolesListResponse,
  ClientRoleUpdateRequest,
  ClientRoleUpdateResponse,
  ClientUserCreateRequest,
  ClientUserCreateResponse,
  ClientUserDetailsResponse,
  ClientUsersListParams,
  ClientUsersListResponse,
  ClientUserUpdateRequest,
  ClientUserUpdateResponse,
} from './types';

export const clientUsersService = {
  async list(params: ClientUsersListParams): Promise<ClientUsersListResponse> {
    const { data } = await adminEndpoints.listUsers({ ...params, sortOrder: 'DESC' });
    return data;
  },
  async getById(id: string): Promise<ClientUserDetailsResponse> {
    const { data } = await adminEndpoints.getUserById(id);
    return data;
  },
  async create(payload: ClientUserCreateRequest): Promise<ClientUserCreateResponse> {
    const { data } = await adminEndpoints.createUser(payload);
    return data;
  },
  async update(id: string, payload: ClientUserUpdateRequest): Promise<ClientUserUpdateResponse> {
    const { data } = await adminEndpoints.updateUser(id, payload);
    return data;
  },
};

export const clientRolesService = {
  async list(params: ClientRolesListParams): Promise<ClientRolesListResponse> {
    const { data } = await adminEndpoints.listRoles({ ...params, sortOrder: 'DESC' });
    return data;
  },
  async getById(id: string): Promise<ClientRoleDetailsResponse> {
    const { data } = await adminEndpoints.getRoleById(id);
    return data;
  },
  async create(payload: ClientRoleCreateRequest): Promise<ClientRoleCreateResponse> {
    const { data } = await adminEndpoints.createRole(payload);
    return data;
  },
  async update(id: string, payload: ClientRoleUpdateRequest): Promise<ClientRoleUpdateResponse> {
    const { data } = await adminEndpoints.updateRole(id, payload);
    return data;
  },
};

export const clientPermissionsService = {
  async list(params?: { page?: number; limit?: number }): Promise<ClientPermissionsListResponse> {
    const { data } = await adminEndpoints.listPermissions(params);
    return data;
  },
};
