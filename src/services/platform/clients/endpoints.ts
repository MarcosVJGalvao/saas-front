import { httpClient } from '../../httpClient';
import type {
  ClientCreatePayload,
  ClientCreateResponse,
  ClientDeleteResponse,
  ClientDetailsResponse,
  ClientOnboardPayload,
  ClientOnboardResponse,
  ClientsListParams,
  ClientsListResponse,
  ClientUpdatePayload,
  ClientUpdateResponse,
} from './types';

const PLATFORM_CLIENTS_BASE_PATH = '/api/platform/clients';

export const platformClientsEndpoints = {
  list: (params: ClientsListParams) =>
    httpClient.get<ClientsListResponse>(PLATFORM_CLIENTS_BASE_PATH, { params }),

  getById: (id: string) =>
    httpClient.get<ClientDetailsResponse>(`${PLATFORM_CLIENTS_BASE_PATH}/${id}`),

  create: (payload: ClientCreatePayload) =>
    httpClient.post<ClientCreateResponse>(PLATFORM_CLIENTS_BASE_PATH, payload),

  update: (id: string, payload: ClientUpdatePayload) =>
    httpClient.patch<ClientUpdateResponse>(`${PLATFORM_CLIENTS_BASE_PATH}/${id}`, payload),

  remove: (id: string) =>
    httpClient.delete<ClientDeleteResponse>(`${PLATFORM_CLIENTS_BASE_PATH}/${id}`),

  onboard: (payload: ClientOnboardPayload) =>
    httpClient.post<ClientOnboardResponse>(`${PLATFORM_CLIENTS_BASE_PATH}/onboarding`, payload),
};
