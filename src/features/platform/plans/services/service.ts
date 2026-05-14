import { platformPlansEndpoints } from '@features/platform/plans/services/endpoints';
import type {
  PlanCreatePayload,
  PlanCreateResponse,
  PlanDetailsResponse,
  PlansListParams,
  PlansListResponse,
  PlanUpdatePayload,
  PlanUpdateResponse,
} from '@features/platform/plans/services/types';

export const plansService = {
  async list(params: PlansListParams): Promise<PlansListResponse> {
    const { data } = await platformPlansEndpoints.list(params);
    return data;
  },
  async getById(id: string): Promise<PlanDetailsResponse> {
    const { data } = await platformPlansEndpoints.getById(id);
    return data;
  },
  async create(payload: PlanCreatePayload): Promise<PlanCreateResponse> {
    const { data } = await platformPlansEndpoints.create(payload);
    return data;
  },
  async update(id: string, payload: PlanUpdatePayload): Promise<PlanUpdateResponse> {
    const { data } = await platformPlansEndpoints.update(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await platformPlansEndpoints.remove(id);
  },
};
