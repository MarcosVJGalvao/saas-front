import type {
  Client,
  ClientOnboardingResponse,
  ClientsQueryParams,
  CreateClientOnboardingRequest,
  CreateClientRequest,
  UpdateClientRequest,
} from '@features/clients/types/clients';
import type { PaginatedResponse } from '@models/pagination';

export type ClientsListResponse = PaginatedResponse<Client>;
export type ClientDetailsResponse = Client;
export type ClientCreateResponse = Client;
export type ClientUpdateResponse = Client;
export type ClientDeleteResponse = void;
export type ClientOnboardResponse = ClientOnboardingResponse;

export type ClientsListParams = ClientsQueryParams;
export type ClientCreatePayload = CreateClientRequest;
export type ClientUpdatePayload = UpdateClientRequest;
export type ClientOnboardPayload = CreateClientOnboardingRequest;
