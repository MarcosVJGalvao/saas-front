import { httpClient } from '@shared/services/httpClient';
import type {
  PlanCreatePayload,
  PlanCreateResponse,
  PlanDeleteResponse,
  PlanDetailsResponse,
  PlansListParams,
  PlansListResponse,
  PlanUpdatePayload,
  PlanUpdateResponse,
} from '@features/plans/services/types';

const PLATFORM_PLANS_BASE_PATH = '/api/platform/plans';

export const platformPlansEndpoints = {
  list: (params: PlansListParams) =>
    httpClient.get<PlansListResponse>(PLATFORM_PLANS_BASE_PATH, {
      params: { ...params, sortOrder: 'DESC' },
    }),
  getById: (id: string) => httpClient.get<PlanDetailsResponse>(`${PLATFORM_PLANS_BASE_PATH}/${id}`),
  create: (payload: PlanCreatePayload) =>
    httpClient.post<PlanCreateResponse>(PLATFORM_PLANS_BASE_PATH, payload),
  update: (id: string, payload: PlanUpdatePayload) =>
    httpClient.patch<PlanUpdateResponse>(`${PLATFORM_PLANS_BASE_PATH}/${id}`, payload),
  remove: (id: string) =>
    httpClient.delete<PlanDeleteResponse>(`${PLATFORM_PLANS_BASE_PATH}/${id}`),
};
