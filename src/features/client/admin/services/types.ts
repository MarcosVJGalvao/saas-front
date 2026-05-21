import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  ClientAdminQuery,
  ClientAdminQueryParams,
  ClientRole,
  ClientRoleCreatePayload,
  ClientRoleUpdatePayload,
  ClientUser,
  ClientUserCreatePayload,
  ClientUserUpdatePayload,
} from '@features/client/admin/types/admin.types';

export type ClientUsersListParams = ClientAdminQueryParams;
export type ClientUsersListResponse = PaginatedResponse<ClientUser>;
export type ClientUserDetailsResponse = ClientUser;
export type ClientUserCreateResponse = ClientUser;
export type ClientUserUpdateResponse = ClientUser;

export type ClientRolesListParams = ClientAdminQueryParams;
export type ClientRolesListResponse = PaginatedResponse<ClientRole>;
export type ClientRoleDetailsResponse = ClientRole;
export type ClientRoleCreateResponse = ClientRole;
export type ClientRoleUpdateResponse = ClientRole;

export type ClientUserCreateRequest = ClientUserCreatePayload;
export type ClientUserUpdateRequest = ClientUserUpdatePayload;
export type ClientRoleCreateRequest = ClientRoleCreatePayload;
export type ClientRoleUpdateRequest = ClientRoleUpdatePayload;

export type ClientAdminReportParams = ClientAdminQuery;
