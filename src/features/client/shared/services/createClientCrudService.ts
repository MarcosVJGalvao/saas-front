import { httpClient } from '@shared/services/httpClient';
import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  ClientBaseQueryParams,
  ClientCrudService,
} from '@features/client/shared/types/clientApi.types';

export const createClientCrudService = <
  TListItem,
  TDetail,
  TCreatePayload,
  TUpdatePayload,
  TQuery extends ClientBaseQueryParams,
>(
  basePath: string,
): ClientCrudService<TListItem, TDetail, TCreatePayload, TUpdatePayload, TQuery> => ({
  async list(params: TQuery): Promise<PaginatedResponse<TListItem>> {
    const { data } = await httpClient.get<PaginatedResponse<TListItem>>(basePath, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    });
    return data;
  },

  async getById(id: string): Promise<TDetail> {
    const { data } = await httpClient.get<TDetail>(`${basePath}/${id}`);
    return data;
  },

  async create(payload: TCreatePayload): Promise<TDetail> {
    const { data } = await httpClient.post<TDetail>(basePath, payload);
    return data;
  },

  async update(id: string, payload: TUpdatePayload): Promise<TDetail> {
    const { data } = await httpClient.patch<TDetail>(`${basePath}/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete<void>(`${basePath}/${id}`);
  },
});
