import { platformClientsEndpoints } from '@features/clients/services/endpoints';
import type {
  ClientCreatePayload,
  ClientCreateResponse,
  ClientDetailsResponse,
  ClientOnboardPayload,
  ClientOnboardResponse,
  ClientsListParams,
  ClientsListResponse,
  ClientUpdatePayload,
  ClientUpdateResponse,
} from '@features/clients/services/types';

export const clientsService = {
  async list(params: ClientsListParams): Promise<ClientsListResponse> {
    const { data } = await platformClientsEndpoints.list(params);
    return data;
  },

  async getById(id: string): Promise<ClientDetailsResponse> {
    const { data } = await platformClientsEndpoints.getById(id);
    return data;
  },

  async create(payload: ClientCreatePayload): Promise<ClientCreateResponse> {
    const { data } = await platformClientsEndpoints.create(payload);
    return data;
  },

  async update(id: string, payload: ClientUpdatePayload): Promise<ClientUpdateResponse> {
    const { data } = await platformClientsEndpoints.update(id, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await platformClientsEndpoints.remove(id);
  },

  async onboard(payload: ClientOnboardPayload): Promise<ClientOnboardResponse> {
    const { data } = await platformClientsEndpoints.onboard(payload);
    return data;
  },
};
