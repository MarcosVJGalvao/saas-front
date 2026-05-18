import type { PaginatedResponse } from '@shared/types/pagination';

export type ClientBaseQueryParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'ASC' | 'DESC' | undefined;
};

export type ClientCrudService<
  TListItem,
  TDetail,
  TCreatePayload,
  TUpdatePayload,
  TQuery extends ClientBaseQueryParams,
> = {
  list: (params: TQuery) => Promise<PaginatedResponse<TListItem>>;
  getById: (id: string) => Promise<TDetail>;
  create: (payload: TCreatePayload) => Promise<TDetail>;
  update: (id: string, payload: TUpdatePayload) => Promise<TDetail>;
  remove: (id: string) => Promise<void>;
};

export type ClientApiRecord = Record<string, unknown>;
