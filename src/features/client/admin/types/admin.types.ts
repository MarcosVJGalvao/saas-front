import type { ActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type {
  ClientApiRecord,
  ClientBaseQueryParams,
} from '@features/client/shared/types/clientApi.types';

export type ClientAdminStatus = ActiveInactiveStatus;

export type ClientUserRole = {
  id: string;
  name: string;
};

export type ClientUser = {
  id: string;
  name?: string | undefined;
  fullName?: string | undefined;
  email?: string | undefined;
  status?: ClientAdminStatus | undefined;
  role?: ClientUserRole | null;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type ClientRolePermission = {
  id: string;
  name: string;
  description: string;
};

export type ClientRole = {
  id: string;
  name: string;
  description?: string | undefined;
  status?: ClientAdminStatus | undefined;
  permissionsCount?: number | undefined;
  permissions?: ClientRolePermission[] | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type ClientAdminEntity = ClientUser | ClientRole;

export type ClientAdminQueryParams = ClientBaseQueryParams & {
  status?: ClientAdminStatus | undefined;
};

export type ClientUserCreatePayload = {
  name: string;
  fullName: string;
  email?: string | undefined;
  roleId?: string | undefined;
  status: ClientAdminStatus;
};

export type ClientUserUpdatePayload = Partial<ClientUserCreatePayload>;

export type ClientRoleCreatePayload = {
  name: string;
  description?: string | undefined;
  permissionIds: string[];
};

export type ClientRoleUpdatePayload = {
  name?: string | undefined;
  description?: string | undefined;
  permissionIds?: string[] | undefined;
};

export type ClientAdminQuery = ClientBaseQueryParams & ClientApiRecord;
