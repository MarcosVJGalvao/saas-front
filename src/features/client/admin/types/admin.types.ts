import type { ActiveInactiveStatus } from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type ClientAdminStatus = ActiveInactiveStatus;

export type ClientUser = {
  id: string;
  name?: string | undefined;
  fullName?: string | undefined;
  email?: string | undefined;
  status?: ClientAdminStatus | undefined;
  role?: {
    id: string;
    name: string;
  } | null;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type ClientRole = {
  id: string;
  name: string;
  description?: string | undefined;
  status?: ClientAdminStatus | undefined;
  permissionsCount?: number | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type ClientAdminEntity = ClientUser | ClientRole;

export type ClientAdminQueryParams = ClientBaseQueryParams & {
  status?: ClientAdminStatus | undefined;
};

export type ClientAdminPayload = Record<string, unknown>;
